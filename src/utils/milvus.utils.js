const { MilvusClient } = require("@zilliz/milvus2-sdk-node");
require('dotenv');

const NODE_ENV = process.env.NODE_ENV;

const MILVUS_ENDPOINT = process.env[`${NODE_ENV}_MILVUS_ENDPOINT`];
const MILVUS_AUTH_KEY = process.env[`${NODE_ENV}_MILVUS_AUTH_KEY`];


// StoreVectorEmbeddingOfChunkInMilvusVectorDBUtil is a utility function to store the vector embedding of a chunk in the Milvus Vector Database.
const StoreVectorEmbeddingOfChunkInMilvusVectorDBUtil = async (vector, keyId, accountId) => {
    try {
        const Client = new MilvusClient({ // Create a new Milvus client with the endpoint and auth key.
            address: MILVUS_ENDPOINT,
            token: MILVUS_AUTH_KEY,
            timeout: 60000
        })

        const milvusResponse = await Client.insert({ // Insert the vector embedding into the Milvus Vector Database.
            collection_name: "text_embedding", // Collection name in which the vector embedding will be stored.
            data: [{ // Data to be inserted into the collection.
                vector_embedding: vector,
                key_id: keyId,
                account_id: accountId
            }]
        })

        if (milvusResponse.insert_cnt != "1") { // If the vector embedding is not inserted successfully.
            throw new Error(`Unable to save the Vector Embedding inside the Milvus`);
        }

        return {
            success: true
        }
    } catch (err) {
        console.log(`Error in StoreVectorEmbeddingOfChunkInMilvusVectorDBUtil with error - ${err}`);
        return {
            success: false,
            message: err.message
        }

    }
}

module.exports = StoreVectorEmbeddingOfChunkInMilvusVectorDBUtil;