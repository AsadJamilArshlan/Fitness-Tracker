const ActivityLog = require('../models/ActivityLog');

// @route   GET /api/activity-logs
exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

// @route   POST /api/activity-logs
exports.createActivityLog = async (req, res) => {
  try {
    const { name, duration, calories } = req.body.data || req.body;

    if (!name || !duration || !calories) {
      return res.status(400).json({ error: { message: 'Please provide name, duration, and calories' } });
    }

    const log = await ActivityLog.create({
      user: req.user.id,
      name,
      duration,
      calories,
    });

    res.status(201).json(log.toJSON());
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

// @route   DELETE /api/activity-logs/:id
exports.deleteActivityLog = async (req, res) => {
  try {
    const log = await ActivityLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ error: { message: 'Activity log not found' } });
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
