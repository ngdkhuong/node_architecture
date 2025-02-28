'use strict';

const { Schema, model } = require('mongoose');
const slugify = require('slugify');

const DOCUMENT_NAME = 'Products';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema(
    {
        product_name: { type: String, require: true },
        product_thumb: { type: String, require: true },
        product_description: String,
        product_slug: String,
        product_price: { type: String, require: true },
        product_quantity: { type: String, require: true },
        product_type: {
            type: String,
            require: true,
            enum: ['Electronic', 'Clothing', 'Furniture'],
        },
        product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
        product_attributes: { type: Schema.Types.Mixed, require: true },
        // more
        product_ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be above 5.0'],
            set: (val) => Math.round(val * 10) / 10,
        },
        product_variations: { type: Array, default: [] },
        isDraft: { type: Boolean, default: true, index: true, select: false },
        isPublished: { type: Boolean, default: false, index: true, select: false },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    },
);

// create index for search
productSchema.index({ product_name: 'text', product_description: 'text' });

// Document middleware: run before .save() and .create()
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});

// define the product type = Clothing
const clothingSchema = new Schema(
    {
        brand: { type: String, require: true },
        size: String,
        material: String,
        product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    },
    {
        collection: 'clothes',
        timestamps: true,
    },
);

// define the product type = Electronic
const electronicSchema = new Schema(
    {
        manufacturer: { type: String, require: true },
        model: String,
        color: String,
        product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    },
    {
        collection: 'electronics',
        timestamps: true,
    },
);

// define the product type = Furniture
const furnitureSchema = new Schema(
    {
        brand: { type: String, require: true },
        size: String,
        material: String,
        product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    },
    {
        collection: 'furnitures',
        timestamps: true,
    },
);

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronics', electronicSchema),
    furniture: model('Furniture', furnitureSchema),
};
