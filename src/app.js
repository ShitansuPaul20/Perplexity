const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.routes');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth" , authRouter);

module.exports = app;
