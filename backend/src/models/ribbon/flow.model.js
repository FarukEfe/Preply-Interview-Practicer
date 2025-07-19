import mongoose from "mongoose";

// Relational entity to bind RibbonAPI flows to user id
const flowSchema = new mongoose.Schema({
    flowId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    interviews: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const Flow = mongoose.model("Flow", flowSchema);

export default Flow;