const express = require('express');

const DeleteUserByUserIdController = require('./../../controllers/user.controller');
const { AuthenticationMiddleware, AuthoriztionMiddlewareGenerator } = require('./../../middlewares/auth.middleware');

const userRouter = express.Router();

userRouter.delete('/delete:userId', AuthenticationMiddleware, AuthoriztionMiddlewareGenerator("ORG_ADMIN"), DeleteUserByUserIdController)

module.exports = userRouter;