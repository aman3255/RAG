const express = require("express")
const { IndexNewPDFController } = require("./../../controllers/pdf.controller") // IndexNewPDFController is the controller function to create a new PDF.
const { PdfUploadMiddleware } = require("./../../middlewares/multer.middleware") // PdfUploadMiddleware is the middleware to upload the PDFs.
const { AuthenticationMiddleware, AuthoriztionMiddlewareGenerator } = require("./../../middlewares/auth.middleware") //  AuthenticationMiddleware is the middleware to authenticate the user, AuthoriztionMiddlewareGenerator is the middleware to authorize the user.

const pdfRouter = express.Router()

pdfRouter.post("/new", AuthenticationMiddleware, AuthoriztionMiddlewareGenerator("ORG_ADMIN"), PdfUploadMiddleware.single('data'), IndexNewPDFController); // Here we are using the PdfUploadMiddleware to upload the PDFs. The single() function is used to upload a single file. The 'data' is the name of the field in the form data. The IndexNewPDFController is the controller function to create a new PDF.

module.exports = pdfRouter