const jwt = require('jsonwebtoken');
require('dotenv').config();
const NODE_ENV = process.env.NODE_ENV;

const JWT_SECRET_KEY = process.env[`${NODE_ENV}_JWT_SECRET_KEY`];

// This middleware will check if the user is authenticated or not.
const AuthenticationMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const tokenVerifyResult = await jwt.verify(token, JWT_SECRET_KEY);

        const {userId, role} = tokenVerifyResult;
        req.userId = userId;
        req.role = role;
    } catch (err) {
        console.log(`Error in AuthenticationMiddleware with error - ${err}`);
        res.status(err.statusCode ? err.statusCode : 500).json({
            success: false,
            message: "You are not allowed to send the request"
        })
    }
}

// This middleware will check if the user is authorized to access the resource or not.
const AuthoriztionMiddlewareGenerator = (role) => {
    return async (req, res, next) => {
        try {
            if(req.role === role){
                next();
            }else{
                const err =  new Error(`Unauthorized to access this resource`);
                err.statusCode = 403;
                throw err;
            }
        } catch (err) {
            console.log(`Error in ${role} AuthoriztionMiddlewareGenerator with err : ${err}`);
            res.status(err.statusCode ? err.statusCode : 500).json({
                success: false,
                message: err.message
            })
        }
    }
}

module.exports = {
    AuthenticationMiddleware,
    AuthoriztionMiddlewareGenerator
}