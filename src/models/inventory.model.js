'use strict';

const { Schema, model } = require('mongoose');
const slugify = require('slugify');

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new Schema(
    {
        inventory_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        inventory_location: { type: String, default: 'unKnow' },
        inventory_stock: { type: Number, require: true },
        inventory_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
        inventory_reservations: { type: Array, default: [] },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    },
);

module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema),
};
