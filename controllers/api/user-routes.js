const router = require('express').Router();
const { Post, User, Comment } = require('../../models');

// gets all users
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] } 
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'There has been an error' });
    });
});

// will grab one user by the id
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
          {
            model: Post,
            attributes: ['id', 'title', 'content', 'created_at']
          },
          {
            model: Comment,
            attributes: ['id', 'text', 'created_at'],
            include: {
              model: Post,
              attributes: ['title']
            }
          }
        ]
      
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'There has been an error' });
    });

});

// This section will add a user
router.post('/', (req, res) => {
  console.log(req.body)
    // expects {username: 'Prestonw15', email: 'prestonwatson.15@gmail.com', 'password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;

        res.json(dbUserData);
      });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'An error occured' });
    });

});
//login route
router.post('/login', (req, res) => {
    // expects {username: 'username', password: 'password1234'}
    User.findOne({
      where: {
        username: req.body.username
      }
    }).then(dbUserData => {
      if (!dbUserData) {
        res.status(400).json({ message: 'No user with that Username' });
        return;
      }
  
      const validPassword = dbUserData.checkPassword(req.body.password);
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect Password!' });
        return;
      }
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;

        res.json({ user: dbUserData, message: "You are now logged in!" });
      });
      
    });
  });
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
  
    // pass in req.body instead to only update what's passed through
    User.update(req.body, {
      individualHooks: true,
      where: {
        id: req.params.id
      }
    })
      .then(dbUserData => {
        if (!dbUserData[0]) {
          res.status(404).json({ message: 'User with this ID not found' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
// this will delete a user
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'User with this ID not found' });
            return;
        }
        res.json({ message: 'This user has now been deleted!' });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'An error occured' });
    });
});

//logs you out of the application
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
    res.render('homepage');
  }
  else {
    res.status(404).end();
  }
});

module.exports = router;