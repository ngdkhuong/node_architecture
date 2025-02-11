'use strict';

import { model, Schema, Types } from 'mongoose';

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

// Declare the Schema of the Mongo model
const userSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            maxLength: 150,
        },
        email: {
            type: String,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'inactive',
        },
        verify: {
            type: Schema.Types.Boolean,
            default: false,
        },
        roles: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

const userModel = model(DOCUMENT_NAME, userSchema);

//Export the model
export default userModel;
