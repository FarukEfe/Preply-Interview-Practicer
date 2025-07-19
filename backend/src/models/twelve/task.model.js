import mongoose from "mongoose";

const twelveTaskSchema = new mongoose.Schema({
    taskId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const TwelveTask = mongoose.model("TwelveTask", twelveTaskSchema);

export default TwelveTask;
