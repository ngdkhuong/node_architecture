'use strict';

import { Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

const tokenSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // TODO: MINI System: --add private key
        // privateKey: {
        //     type: String,
        //     required: true,
        // },
        publicKey: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

const tokenModel = model(DOCUMENT_NAME, tokenSchema);

//Export the model
export default tokenModel;
