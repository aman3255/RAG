const mongoose = require('mongoose');

// EmbeddingsSchema - This schema will define the structure of the embeddings collection in mongoDB.
const EmbeddingsSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true,
        enum: ["pdf", "webpage"]
    },
    source_id: {
        type: String,
    },
    chunk_no: {
        type: String
    }
})

const EMBEDDINGSModel = mongoose.model('embeddings', EmbeddingsSchema);
module.exports = EMBEDDINGSModel;