const express = require('express'); // Import express module to create server.
const cors = require('cors'); // Import cors module to enable cross-origin resource sharing.


require('dotenv').config(); // Import dotenv module to use environment variables.
require('./db/connect'); // Import connect.js file to connect to database.
const v1Router =  require('./routers/v1/v1.router'); // Import v1.router.js file.
const RequestLoggerMiddleware =  require('./middlewares/requestlogger.middleware')

const NODE_ENV = process.env.NODE_ENV; // Get the value of NODE_ENV from .env file.
const PORT = process.env[`${NODE_ENV}_PORT`]; // Get the value of PORT from .env file.

const server = express(); // Create server.
server.use(express.json()); // It will parse the body of the request into JSON.
server.use(RequestLoggerMiddleware); // Use RequestLoggerMiddleware for logging the request.

server.use(cors()); // Enable cross-origin resource sharing means all ip usage.
server.use('/api/v1', v1Router); // Use v1Router for /api/v1 route.


server.listen(PORT, () => {
    console.log(`${NODE_ENV} server is running on port - ${PORT}`);
})
