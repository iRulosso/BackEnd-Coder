import mongoose from 'mongoose';

const productCollection = "products";

const productSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    thumbnail: {
        type: String
    },
    code: {
        type: Number,
        unique: true
    },
    stock: {
        type: Number
    }
});

export const productModel = mongoose.model(productCollection, productSchema);