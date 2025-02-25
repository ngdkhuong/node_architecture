'use strict';

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'ApiKeys';

const apiKeySchema = new Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
        permission: {
            type: [String],
            required: true,
            enum: ['0000', '1111', '2222'],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

const apiKeyModel = model(DOCUMENT_NAME, apiKeySchema);

//Export the model
module.exports = apiKeyModel;
