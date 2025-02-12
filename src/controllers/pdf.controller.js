const fs = require('fs');
// ===== Import the required services =====
const ConvertPDFToTextUtil = require('./../utils/pdf.utils');
const GenerateVectorEmbeddingOfTextUtil = require('./../utils/openai.utils');
const { CreateNewPDFEntryService, UpdateTheIndexedInfoOfPDFService, CheckPdfDuplicacyService } = require('./../services/pdf.service')
const { FetchOrganizationIdUsingTheUserIdService } = require('./../services/user.service')
const CreateNewChunkEntryService = require('./../services/embedding.service');
const { StoreVectorEmbeddingOfChunkInMilvusVectorDBUtil } = require('./../utils/milvus.utils');
// ========================================


// ==== This ConvertLargeTextToChunks function will convert the large text into chunks of 400 words each. =====
const ConvertLargeTextToChunks = (largeText, chunkSize = 400) => {
    const wordArray = largeText.trim().split(" "); // largeText is of 2000 words.
    const wordArrayLength = wordArray.length; // 2000

    const chunks = []; // This will store the chunks of 400 words each.

    for (let i = 0; i < Math.ceil(wordArrayLength / chunkSize); i++) { // Ensures loop runs for all words
        const startIndex = i * chunkSize; // 0, 400, 800, 1200, 1600
        const endIndex = startIndex + chunkSize; // 400, 800, 1200, 1600, 2000

        const chunk = wordArray.slice(startIndex, endIndex).join(" "); // 0-400, 400-800, 800-1200, 1200-1600, 1600-2000

        chunks.push(chunk); // Push the chunk into the chunks array.
    }
    return chunks;
}
// ================================================================================================================

const IndexNewPDFController = async (req, res) => {
    try {
        const source = "pdf"; // Get the source from the request body.

        const { originalname: pdfName, path: pdfPath, size: pdfSize } = req.file; // Get the values of originalname, path, size from the request file.

        const userId = req.userId; // Get the userId from the request.

        // === Read the PDF file and convert it into text. ===
        const FetchOrganizationIdUsingTheUserIdServiceResult = await FetchOrganizationIdUsingTheUserIdService(userId); // Fetch the organizationId using the userId.
        if (!FetchOrganizationIdUsingTheUserIdServiceResult.success) { // If the FetchOrganizationIdUsingTheUserIdServiceResult is not successful.
            const err = new Error("Error in FetchOrganizationIdUsingTheUserIdService");
            err.statusCode = 500;
            throw err;
        }
        const { data: organizationId } = FetchOrganizationIdUsingTheUserIdServiceResult; // Get the organizationId from the FetchOrganizationIdUsingTheUserIdServiceResult.
        // ================================================================================================================

        // ===== check for duplicate pdf indexing. pdfName + pdfSize combination should be different ===============
        const CheckPdfDuplicacyServiceResult = await CheckPdfDuplicacyService(pdfName, pdfSize, organizationId);
        if (CheckPdfDuplicacyServiceResult.success) {
            fs.unlinkSync(pdfPath);
            const err = new Error("PDF is already indexed.");
            err.statusCode = 500;
            throw err;
        }

        // ================================================================================================================

        // === Convert the PDF to text and store the text in the database. ===
        const pdfConvertResult = await ConvertPDFToTextUtil(pdfPath);
        if (!pdfConvertResult.success) {
            const err = new Error("Error while converting PDF to text(in ConvertPDFToTextUtil).");
            err.statusCode = 500;
            throw err;
        }
        const { numpages: numOfPagesInPdf, info: { Title: pdfTitle, Author: pdfAuthor }, text: pdfText } = pdfConvertResult.data;
        // ================================================================================================================

        // ======= we have to store pdf meta info like name, page_no, owner etc in mongoDB ==========
        const CreateNewPDFEntryServiceResult = await CreateNewPDFEntryService(pdfName, pdfAuthor, organizationId, pdfSize, numOfPagesInPdf);
        if (!CreateNewPDFEntryServiceResult.success) {
            const err = new Error("Unable to create entry for pdf in pdfs collection of mongoDB(in CreateNewPDFEntryService).");
            err.statusCode = 500;
            throw err;
        }
        const { data: { _id: sourceId } } = CreateNewPDFEntryServiceResult;
        // ================================================================================================================

        // === Convert pdf into small small chunk. small small chunck combinely knows as chunks. Array of chunks. === 
        const chunks = ConvertLargeTextToChunks(pdfText);
        chunks.forEach(async (chunk, index) => {
            // For each chunk, we have to store the chunk in the database.
            const chunkNo = index + 1;

            const GenerateVectorEmbeddingOfTextUtilResult = await GenerateVectorEmbeddingOfTextUtil(chunk); // Generate vector embedding of the chunk.
            if (!GenerateVectorEmbeddingOfTextUtilResult.success) {
                console.log(`Error while generating vector embedding of chunk with chunkNo. ${chunkNo} for pdf with name ${pdfName}`);
                return;
            }

            const { data: { vectorEmbedding } } = GenerateVectorEmbeddingOfTextUtilResult;
            // ================================================================================================================

            // ======= store the chunk in plain text into the mongoDB ======
            const CreateNewChunkEntryServiceResult = await CreateNewChunkEntryService(chunk, source, sourceId, chunkNo);
            if (!CreateNewChunkEntryServiceResult.success) {
                console.log(`Error while creating chunk entry of chunk with chunkNo ${chunkNo} in embeddings collection of mongoDB for pdf with name : ${pdfName} and organizationId : ${organizationId}`);
                return;
            }
            const { data: { _id } } = CreateNewChunkEntryServiceResult;
            // ================================================================================================================

            // ==== store the vector embedding of chunk in vector db i.e Milvus =====
            const StoreVectorEmbeddingOfChunkInMilvusVectorDBUtilResult = await StoreVectorEmbeddingOfChunkInMilvusVectorDBUtil(sourceId);
            if (!StoreVectorEmbeddingOfChunkInMilvusVectorDBUtilResult.success) {
                console.log(`Error while saving vector embedding of chunk with chunkNo ${chunkNo} in milvus vector database for pdf with name : ${pdfName} and organizationId : ${organizationId}`);
            }
            // ================================================================================================================
        });

        // =================== update the pdf is_indexed and indexed_at value in mongoDB ==========
        const UpdateTheIndexedInfoOfPDFServiceResult = await UpdateTheIndexedInfoOfPDFService(sourceId);
        if (!UpdateTheIndexedInfoOfPDFServiceResult.success) {
            console.log(`Error while updating indexed info of pdf in MongoDB for pdf with name : ${pdfName} and organizationId : ${organizationId}`);
        }
        // ================================================================================================================

        // upload the pdf to the file static storage services like cloudinary or aws s3

        // delete the pdf form the uploads/pdfs folder

        fs.unlinkSync(pdfPath); // Delete the pdf from the uploads/pdfs folder.

        console.log(`PDF with name ${pdfName} is indexed successfully.`);

        res.status(200).json({
            success: true,
            message: "PDF is indexed successfully."
        });

    } catch (err) {
        console.log(`Error in IndexNewPDFController with error - ${err}`);
        res.status(err.statusCode ? err.statusCode : 500).json({
            success: false,
            message: err.message
        });
    }
}

module.exports = IndexNewPDFController;
