const express = require('express');
const { SignupController, SigninController } = require('./../../controllers/auth.controller');

const authRouter = express.Router(); // Create a new router for /auth route.

// ===== Define the routes for /auth route. =======
authRouter.post('/signup', SignupController);
authRouter.post('/signin', SigninController);
// ================================================

module.exports = authRouter; 