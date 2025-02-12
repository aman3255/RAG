const axios = require("axios");

require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV; // Fixed typo: `process.NODE_ENV` → `process.env.NODE_ENV`

const OPENAI_API_KEY = process.env[`${NODE_ENV}_OPENAI_API_KEY`];

const EMBEDDING_MODEL = process.env[`${NODE_ENV}_EMBEDDING_MODEL`];

const GenerateVectorEmbeddingOfTextUtil = async (text) => {
    try {
        const OPENAI_EMBEDDING_MODEL_API_URL = "https://api.openai.com/v1/embeddings"; // OpenAI API URL for embedding model.

        const data = { // Data to be sent to the OpenAI API.
            model: EMBEDDING_MODEL, // Set the model to the embedding model.
            input: text // FIXED: `text` → `input`, as per OpenAI's API requirements.
        };

        const config = { // Configuration for the axios post request.
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`, // Add the OpenAI API key to the headers.
                'Content-Type': 'application/json' // Set the content type to application/json.
            }
        };

        const apiResult = await axios.post(OPENAI_EMBEDDING_MODEL_API_URL, data, config); // Call the OpenAI API to get the vector embedding of the text.

        if (!apiResult.data || !apiResult.data.data || apiResult.data.data.length === 0) { // If the response from the OpenAI API is not as expected.
            throw new Error(`Error while generating vector embedding of the text.`);
        }

        return {
            success: true,
            data: apiResult.data.data[0].embedding
        };

    } catch (error) {
        console.log(`Error in GenerateVectorEmbeddingOfTextUtil with error - ${error}`);
        return {
            success: false,
            message: error.message
        };
    }
};

module.exports = GenerateVectorEmbeddingOfTextUtil;
