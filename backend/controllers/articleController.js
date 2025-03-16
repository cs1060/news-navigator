const Article = require('../models/Article');
const User = require('../models/User');

// Save an article
exports.saveArticle = async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      url,
      urlToImage,
      publishedAt,
      source,
      author,
      category,
      biasRating,
      biasDescription
    } = req.body;

    // Check if article already exists
    let article = await Article.findOne({ url });

    if (!article) {
      // Create new article if it doesn't exist
      article = new Article({
        title,
        description,
        content,
        url,
        urlToImage,
        publishedAt: new Date(publishedAt),
        source,
        author,
        category,
        biasRating,
        biasDescription
      });
      await article.save();
    }

    // Check if user has already saved this article
    const user = await User.findById(req.user.id);
    if (user.savedArticles.includes(article._id)) {
      return res.status(400).json({ message: 'Article already saved' });
    }

    // Add article to user's saved articles
    user.savedArticles.push(article._id);
    await user.save();

    // Add user to article's savedBy list
    if (!article.savedBy.includes(req.user.id)) {
      article.savedBy.push(req.user.id);
      await article.save();
    }

    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all saved articles for a user
exports.getSavedArticles = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedArticles');
    res.json(user.savedArticles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get saved articles by category
exports.getArticlesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const user = await User.findById(req.user.id);
    
    const articles = await Article.find({
      _id: { $in: user.savedArticles },
      category
    });
    
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get saved articles by date range
exports.getArticlesByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const user = await User.findById(req.user.id);
    
    const query = {
      _id: { $in: user.savedArticles }
    };
    
    if (startDate && endDate) {
      query.publishedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      query.publishedAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.publishedAt = { $lte: new Date(endDate) };
    }
    
    const articles = await Article.find(query).sort({ publishedAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Remove a saved article
exports.removeSavedArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    
    // Remove article from user's saved articles
    const user = await User.findById(req.user.id);
    user.savedArticles = user.savedArticles.filter(id => id.toString() !== articleId);
    await user.save();
    
    // Remove user from article's savedBy list
    const article = await Article.findById(articleId);
    if (article) {
      article.savedBy = article.savedBy.filter(id => id.toString() !== req.user.id);
      await article.save();
    }
    
    res.json({ message: 'Article removed from saved list' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
