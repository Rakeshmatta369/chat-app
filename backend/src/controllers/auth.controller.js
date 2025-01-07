import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Don't forget to complete all the fields before proceeding. 🚀" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Secure your account with a password that's at least 6 characters long. 🛡️" });
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "You're already part of the crew! 🚀" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        })

        if (newUser) {
            // generate jwt token and send to client
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }

    } catch (error) {
        console.log("Error in Signup", error.message);
        res.status(500).json({ error: "Internal server error. The server must be having a bad day. 😅" });
    }
}

export const login = async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Oops! User not found. Did you forget who you are? 🤨" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Oops! User not found. Are you sure you're not a clone? 🤔" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("Error in Login", error.message);
        res.status(500).json({ message: "Internal server error. The server must be having a bad day. 😅" });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0});
        console.log("Cookie cleared");
        res.status(200).json({ message: "You've logged out 🚀, Until we meet again! 👋" });
    } catch (error) {
        console.log("Error in Logout", error.message);
        res.status(500).json({ message: "Internal server error. The server must be having a bad day. 😅" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;
        
        if(!profilePic) {
            return res.status(400).json({ message: "Please upload your beautiful profile picture. 📷" });
        }

        const uploadedResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadedResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
        // res.status(200).json({ message: "Profile updated successfully! 🚀" });

    } catch (error) {
        console.log("Error in Update Profile", error.message);
        res.status(500).json({ message: "Internal server error. The server must be having a bad day. 😅" });
    }
}

export const checkAuth = async (req, res) => { 
    try {
        res.status(200).json(req.user);

    } catch (error) {
        console.log("Error in Check Auth", error.message);
        res.status(500).json({ message: "Internal server error. The server must be having a bad day. 😅" });
    }
}