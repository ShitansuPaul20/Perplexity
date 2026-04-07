const { validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const { sendEmail } = require('../services/mail.service');
const JWT = require('jsonwebtoken');

async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, email, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }]
     });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists' ,
        success: false,
        err: "User already exists"
      });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }

  const newUser = new userModel({
    username,
    email,
    password
  });

  await newUser.save();

  await sendEmail({
    to: email,
    subject: 'Welcome to Perplexity!',
    html: `<h1>Welcome, ${username}!</h1><p>Thank you for registering at Perplexity. We're excited to have you on board!</p>`
  });

  res.status(201).json({ 
    message: 'User created successfully',
    success: true,
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email
    }
  });

}

module.exports = {
  register
};