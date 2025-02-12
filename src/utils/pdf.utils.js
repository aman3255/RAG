const fs = require('fs');
const PdfParse = require('pdf-parse');

// ConvertPDFToTextUtil is a utility function to convert a PDF file to text.
const ConvertPDFToTextUtil = async (pdfPath) => {
    try {
        let pdfDataBuffer = fs.readFileSync(pdfPath); //readFileSync is used to read the file and store it in a buffer.

        const result = await PdfParse(pdfDataBuffer); // PdfParse is used to parse the PDF data buffer and return the text content.

        return {
            success: true,
            data: result
        }
    } catch (err) {
        console.log(`Error in ConvertPDFToTextUtil with error - ${err}`);
        return {
            success: false,
            message: err.message
        }
    }
}

module.exports = ConvertPDFToTextUtil;