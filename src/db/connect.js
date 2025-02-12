const mongoose = require('mongoose');
require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV;

const MONGODB_URI = process.env[`${NODE_ENV}_MONGODB_URI`];

mongoose.connect(MONGODB_URI).then(() => {
    console.log('Database connected successfully');
}).catch((err) => {
    console.log('Error in connecting to database with error - ', err);
})