const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment } = require('../../models');
const Auth = require('../../utils/auth');


// get all posts
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
      attributes: [
        'id',
        'title',
        'content',
        'created_at'
      ],
      order: [['created_at', "DESC"]],
      include: [
          {
              model: Comment,
              attributes: ['id', 'text', 'post_id', 'user_id', 'created_at'],
              include: {
                  model: User,
                  attributes: ['username']
              }
          },
        {
          model: User,
          attributes: ['username']
        }
    ]
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "There has been an error" });
      });
  });

// get a single post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'content', 'created_at'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: "No post found with that id" })
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: "There has been an error" });
    });
});

// This will create the post 
router.post('/', Auth, (req, res) => {
    // expects {title: 'This is the title', content: 'This is the content', user_id: 1}
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'There has been an error!' });
    });
});

// updates the posts title
router.put('/:id', Auth, (req, res) => {
    Post.update({
        title: req.body.title,
    },
    {
        where: {
            id: req.params.id
        }
    }
    )
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: "There has been an error" });
    });
});

// This will allow you to delete a post if you'd like
router.delete('/:id', Auth, (req, res) => {
    console.log(req.params.id, '-------------------');
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: "No post found with this id" })
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: "There has been an error" });
    });
});

module.exports = router;