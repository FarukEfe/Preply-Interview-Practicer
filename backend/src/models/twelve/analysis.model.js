// Holds:
// TwelveLabs: index id, task id, video id, user linkedin id
// Ribbon: Video URL
// analysis results from TwelveLabs task

import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
    taskId: {
        type: String,
        required: true,
    },
    videoId: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    analysisResults: {
        type: Object,
        required: false, // This can be null if the analysis hasn't been performed yet
    },
    userId: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;