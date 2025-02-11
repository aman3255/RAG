
// Middleware to log the request details.
const RequestLoggerMiddleware = async (req, res, next) => {
    try {
        const httpMethod = req.method; // Get the HTTP method.
        const ip =  req.ip; // Get the IP address.
        const url = req.url; // Get the URL.

        console.log(`HTTP Method: ${httpMethod} | IP: ${ip} | URL: ${url}`); // Log the request details.

        next(); // Move to the next middleware.
    } catch (err) { // If any error occurs.
        console.log(`Error in RequestLoggerMiddleware with error - ${err}`); // Log the error.
        res.status(err.statusCode ? err.statusCode : 500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = RequestLoggerMiddleware;