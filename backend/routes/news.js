const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const auth = require('../middleware/auth');

// @route   GET api/news/interests
// @desc    Get news based on user interests
// @access  Private
router.get('/interests', auth, newsController.getNewsByInterests);

// @route   GET api/news/headlines
// @desc    Get top headlines
// @access  Public
router.get('/headlines', newsController.getTopHeadlines);

// @route   GET api/news/search
// @desc    Search for news articles
// @access  Public
router.get('/search', newsController.searchNews);

// @route   GET api/news/country/:country
// @desc    Get news by country for world map
// @access  Public
router.get('/country/:country', newsController.getNewsByCountry);

// @route   GET api/news/global-activity
// @desc    Get global news activity levels for world map
// @access  Public
router.get('/global-activity', newsController.getGlobalNewsActivity);

module.exports = router;
