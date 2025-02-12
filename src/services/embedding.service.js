const EMBEDDINGSModel = require("./../models/embeddings.model");


// CreateNewChunkEntryService - This service will create a new entry for the chunk in the embeddings collection of mongoDB.
const CreateNewChunkEntryService = async (text, source, sourceId, chunkNumber) => {
    try {
        const Chunk = await EMBEDDINGSModel.create({ // Create new entry for the chunk in the embeddings collection of mongoDB.
            text: text,
            source: source,
            source_id: sourceId,
            chunk_no: chunkNumber
        })

        if (Chunk) { // If the entry is created successfully then return the chunk details.
            return {
                success: true,
                data: Chunk
            }
        } else {
            console.log(`Unable to create entry for chunk in embeddings collection of mongoDB`);

        }
    } catch (err) {
        console.log(`Error in CreateNewChunkEntryService with error - ${err}`);
        return {
            success: false,
            message: err.message
        }
    }
}
module.exports = CreateNewChunkEntryService;