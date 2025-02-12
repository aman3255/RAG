const multer = require('multer'); // Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.

// Set the pdf storage guidelines.
const pdfStorage = multer.diskStorage({
    destination: "uploads/pdfs", // Destination folder to store the PDFs.
    filename: (req, file, cb) => { // req: Request object, file: File object, cb: Callback function. This function is used to determine the name of the file.
        const fileName = file.originalname ? file.originalname : `${Date.now()}.pdf`; // If the file has a name, use that name, else use the current timestamp.
        cb(null, fileName); // Callback function to return the file name. Here null is the error and fileName is the result.
    }
});

// PDF filter to check if the file is a PDF or not.
const pdfFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") { // Check if the file is a PDF.
        cb(null, true); // If the file is a PDF, return true. Here null is the error and true is the result.
    } else {
        cb(new Error("Only PDFs are allowed to be uploaded"), false); // Corrected error handling
    }
};

// Middleware to upload the PDFs.
const PdfUploadMiddleware = multer({ // Multer middleware to upload the PDFs.
    storage: pdfStorage, // Storage guidelines for the PDFs.
    fileFilter: pdfFilter // Filter to check if the file is a PDF or not.
});

module.exports = {
    PdfUploadMiddleware
};
