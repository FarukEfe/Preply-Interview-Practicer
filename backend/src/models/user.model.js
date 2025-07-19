// Holds:
// LinkedIn: linkedin in, name, email
// TwelveLabs: index id

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // Create index object in twelve unique to the user
    twelveIndexId: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;