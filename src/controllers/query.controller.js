const { GenerateVectorEmbeddingOfTextUtil } = require('./../utils/openai.utils')

// QueryController is a controller function to handle the query request from the client.
const QueryController = async (req, res) => {
    try {
        const {query} = req.body; // Get the query from the request body.

        const GenerateVectorEmbeddingOfTextUtilResult = await GenerateVectorEmbeddingOfTextUtil(query); // Generate the vector embedding of the query.

        if(!GenerateVectorEmbeddingOfTextUtilResult.success){ // If the GenerateVectorEmbeddingOfTextUtilResult is not successful.
            const err = new Error(`Unable to generate vector embedding of the query.`);
            err.statusCode = 500;
            throw err;
        }
        const {data: queryVector} = GenerateVectorEmbeddingOfTextUtilResult; // Get the query vector from the GenerateVectorEmbeddingOfTextUtilResult.
        console.log(`queryVector: ${queryVector}`);

        // fetch top 5 vector from milvus which is relavent to query vector
        // we have to map top 5 vectors with the original text of chunk
        // query + 5 top chunk text to the LLM for the answer generation

        res.status(201).json({
            success: true,
            answer: ""
        })
    } catch (err) {
        console.log(`Error in QueryController with error - ${err.message}`);
        res.status(err.statusCode ? err.statusCode : 500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = QueryController;