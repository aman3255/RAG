const express = require('express');

const { IndexNewPDFController } = require('./../../controllers/pdf.controller');

const pdfRouter = express.Router();

pdfRouter.post("/new", IndexNewPDFController);

module.exports = pdfRouter;