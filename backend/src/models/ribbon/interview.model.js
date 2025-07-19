import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
    interviewId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    flowId: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;