const express = require('express');

// ========================================
const authRouter = require('./auth.router'); // Import auth.router.js file.
const userRouter = require('./user.router'); // Import user.router.js file.
const pdfRouter = require('./pdf.router'); // Import pdf.router.js file.
const QueryRouter = require('./query.router'); // Import query.router.js file.
// ========================================


const v1Router = express.Router(); // v1Router is for versioning the APIs.

// ========================================
v1Router.use("/auth", authRouter); // Use authRouter for /auth route.
v1Router.use("/user", userRouter); // Use userRouter for /user route.
v1Router.use("/indexing/pdf", pdfRouter); // Use pdfRouter for /indexing/pdf route.
v1Router.use("/query", QueryRouter); // Use QueryRouter for /query route.
// ========================================

module.exports = v1Router;

