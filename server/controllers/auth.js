const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/local/register
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: { message: 'Please provide all fields' } });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: { message: 'Email already taken' } });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        jwt: generateToken(user._id),
        user: user.toJSON()
      });
    } else {
      res.status(400).json({ error: { message: 'Invalid user data' } });
    }
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

// @route   POST /api/auth/local
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: { message: 'Please provide email and password' } });
    }

    const user = await User.findOne({ email: identifier });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        jwt: generateToken(user._id),
        user: user.toJSON()
      });
    } else {
      res.status(400).json({ error: { message: 'Invalid credentials' } });
    }
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};
