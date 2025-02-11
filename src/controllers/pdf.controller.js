const fs = require('fs');


const IndexNewPDFController = async (req, res) => {
    try {
        const { originalName: pdfName, path: pdfPath, size: pdfSize } = req.file; // Get the values of originalName, path, size from the request file.
    } catch (err) {
        console.log(`Error in IndexNewPDFController with error - ${err}`);
        res.status(err.statusCode ? err.statusCode : 500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = IndexNewPDFController;