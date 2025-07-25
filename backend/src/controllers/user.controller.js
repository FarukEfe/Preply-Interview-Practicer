import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import { client } from '../lib/twelve_client.js';
import User from '../models/user.model.js';

export const signIn = async (req, res) => {
    try {
        // Input should be linkedin information post oauth
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required.' });
            return;
        }

        // If signin info not in database, create new user. use linkedin id as user id to check.
        // Instantly generate an index for twelvelabs to be able to submit tasks.
        const result = await User.findOne({ email: email });
        if (!result) {
            res.status(404).json({ message: "User not found."});
            return;
        }

        // Compare passwords with bcrypt
        const isMatch = await bcrypt.compare(password, result.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        res.status(200).json({ 
            _id: result._id, 
            fullname: result.fullname, 
            username: result.username, 
            email: result.email, 
            twelveIndexId: result.twelveIndexId 
        });
    } catch (err) {
        console.error("Error signing in user:", err);
        res.status(500).json({ message: 'Failed to sign in user.', error: err.message });
    }
}

export const signUp = async (req, res) => {
    try {
        const { fullname, username, password, email } = req.body;

        // Validate input
        if (!fullname || !username || !password || !email) {
            res.status(400).json({ message: 'All fields are required.' });
            return;
        }

        // Check if password is valid (only has to be 8 letters)
        if (password.length < 8) {
            res.status(400).json({ message: 'Password must be at least 8 characters long.' });
            return;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists.' });
            return;
        }

        // TwelveLabs index ID generation
        const newIndex = await client.index.create({
            name: `${username}`,
            models: [
                {
                name: "marengo2.7",
                options: ["visual", "audio"],
                },
            ],
            addons: ["thumbnail"],
        });

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            fullname: fullname,
            username: username,
            password: hash, // Note: Password should be hashed in production
            email: email,
            twelveIndexId: newIndex.id, // Generate a unique ID for TwelveLabs index
        });

        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: newUser._id,
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email,
                twelveIndexId: newUser.twelveIndexId,
            },
        });

    } catch (err) {
        console.error("Error signing up user:", err);
        res.status(500).json({ message: 'Failed to sign up user.', error: err.message });
    }
}