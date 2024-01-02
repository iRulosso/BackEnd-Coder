import mongoose from 'mongoose';

const chatCollection = "chats";

const chatSchema = new mongoose.Schema({
    user: {
        type: String
    },
    message: {
        type: String
    }
});

export const chatModel = mongoose.model(chatCollection, chatSchema);