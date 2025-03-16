const User = require('../models/User');

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, interests, preferences } = req.body;
    
    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (interests) updateFields.interests = interests;
    if (preferences) updateFields.preferences = preferences;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
