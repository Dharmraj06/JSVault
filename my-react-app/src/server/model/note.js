import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        required: true,
    },
    isArchived: {
        type: Boolean,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    codeDetails: {
        type: String,
        required: true,
    },
    isTrashed: {
        default: false,
        type: Boolean,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
});

const Note = mongoose.model("Note", noteSchema);
export default Note;