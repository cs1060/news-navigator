const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const auth = require('../middleware/auth');

// @route   POST api/articles
// @desc    Save an article
// @access  Private
router.post('/', auth, articleController.saveArticle);

// @route   GET api/articles
// @desc    Get all saved articles for a user
// @access  Private
router.get('/', auth, articleController.getSavedArticles);

// @route   GET api/articles/category/:category
// @desc    Get saved articles by category
// @access  Private
router.get('/category/:category', auth, articleController.getArticlesByCategory);

// @route   GET api/articles/date
// @desc    Get saved articles by date range
// @access  Private
router.get('/date', auth, articleController.getArticlesByDate);

// @route   DELETE api/articles/:articleId
// @desc    Remove a saved article
// @access  Private
router.delete('/:articleId', auth, articleController.removeSavedArticle);

module.exports = router;
