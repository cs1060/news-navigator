const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  content: {
    type: String
  },
  url: {
    type: String,
    required: true
  },
  urlToImage: {
    type: String
  },
  publishedAt: {
    type: Date,
    required: true
  },
  source: {
    id: String,
    name: String
  },
  author: {
    type: String
  },
  category: {
    type: String,
    enum: ['politics', 'technology', 'business', 'health', 'science', 'sports', 'entertainment', 'world']
  },
  biasRating: {
    type: Number,
    min: -10,
    max: 10,
    default: 0
  },
  biasDescription: {
    type: String
  },
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Article', ArticleSchema);
