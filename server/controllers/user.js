const User = require('../models/User');

// @route   GET /api/users/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }
    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

// @route   PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure the user is updating their own profile
    if (id !== req.user.id.toString()) {
      return res.status(403).json({ error: { message: 'Not authorized to update this user' } });
    }

    const { age, weight, height, goal, dailyCalorieIntake, dailyCalorieBurn } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    if (age !== undefined) user.age = age;
    if (weight !== undefined) user.weight = weight;
    if (height !== undefined) user.height = height;
    if (goal !== undefined) user.goal = goal;
    if (dailyCalorieIntake !== undefined) user.dailyCalorieIntake = dailyCalorieIntake;
    if (dailyCalorieBurn !== undefined) user.dailyCalorieBurn = dailyCalorieBurn;

    await user.save();

    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};
