const { Router } = require('express');
const { register } = require('../controller/auth.controller');

const authRouter = Router();

authRouter.post('/register', register);


module.exports = authRouter;