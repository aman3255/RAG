const PDFSModel = require('./../models/pdfs.model');

// CreateNewPDFEntryService - This service will create a new entry for the pdf in the pdfs collection of mongoDB.
const CreateNewPDFEntryService = async (name, author, organizationId, size, pageCount) => {
    try {
        const PDF = await PDFSModel.create({ // FIXED: Added `await`
            name: name,
            author: author,
            organization: organizationId,
            size: size,
            page_count: pageCount
        });

        if (PDF) { // If the entry is created successfully then return the pdf details.
            return {
                success: true,
                data: PDF
            };
        } else {
            throw new Error(`Unable to create entry for pdf in pdfs collection of mongoDB`);
        }
    } catch (err) {
        console.log(`Error in CreateNewPDFEntryService with error - ${err}`);
        return {
            success: false,
            message: err.message
        };
    }
};

// ================================================================================================================

// UpdateTheIndexedInfoOfPDFService - This service will update the pdf is_indexed and indexed_at value in mongoDB.
const UpdateTheIndexedInfoOfPDFService = async (pdfId) => {
    try {
        // Update the pdf is_indexed and indexed_at value in mongoDB.
        const result = await PDFSModel.findByIdAndUpdate(
            pdfId,
            {
                is_indexed: true,
                indexed_at: Date.now()
            }
        ).exec(); // FIXED: Changed `.exex()` to `.exec()`

        console.log(result);

        if (!result) {
            throw new Error(`Unable to update the indexing info of pdf with pdfId : ${pdfId}`);
        }

        return {
            success: true
        };
    } catch (err) {
        console.log(`Error in UpdateTheIndexedInfoOfPDFService with error - ${err}`);
        return {
            success: false,
            message: err.message
        };
    }
};

// ================================================================================================================

// CheckPdfDuplicacyService - This service will check the duplicacy of the pdf with the given name, size and organizationId.
const CheckPdfDuplicacyService = async (name, size, organizationId) => {
    try {
        const result = await PDFSModel.findOne({ // Find the pdf with the given name, size and organizationId.
            name: name,
            size: size,
            organization: organizationId
        }).exec(); // FIXED: Changed `.exex()` to `.exec()`

        if (!result) {
            console.log(`Unable to check duplicacy of pdf with name: ${name} and size: ${size} and organizationId: ${organizationId}`);
        }

        return {
            success: true
        };
    } catch (err) {
        console.log(`Error in CheckPdfDuplicacyService with error - ${err}`);
        return {
            success: false,
            message: err.message
        };
    }
};

// ================================================================================================================

module.exports = {
    CreateNewPDFEntryService,
    UpdateTheIndexedInfoOfPDFService,
    CheckPdfDuplicacyService
};
