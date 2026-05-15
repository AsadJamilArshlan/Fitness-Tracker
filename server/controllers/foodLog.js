const FoodLog = require('../models/FoodLog');

// @route   GET /api/food-logs
exports.getFoodLogs = async (req, res) => {
  try {
    const logs = await FoodLog.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

// @route   POST /api/food-logs
exports.createFoodLog = async (req, res) => {
  try {
    const { name, calories, mealType } = req.body.data || req.body;

    if (!name || !calories || !mealType) {
      return res.status(400).json({ error: { message: 'Please provide name, calories, and mealType' } });
    }

    const log = await FoodLog.create({
      user: req.user.id,
      name,
      calories,
      mealType,
    });

    res.status(201).json(log.toJSON());
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

// @route   DELETE /api/food-logs/:id
exports.deleteFoodLog = async (req, res) => {
  try {
    const log = await FoodLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ error: { message: 'Food log not found' } });
    }

    if (log.user.toString() !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized to delete this log' } });
    }

    await log.deleteOne();

    res.json({ message: 'Log removed' });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};
