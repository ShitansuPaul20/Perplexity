import userModel from "../models/user.model";
import { validateRegister } from '../validators/auth.validator';

import jwt from 'jsonwebtoken';

export async function register(req, res) {
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

  res.status(201).json({ 
    message: 'User created successfully',
    success: true,
    user: newUser
  });

}
