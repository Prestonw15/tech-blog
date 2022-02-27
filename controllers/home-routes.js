const router = require('express').Router();
const req = require('express/lib/request');
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
