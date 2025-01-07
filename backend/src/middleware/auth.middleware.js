import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    
    try {
        console.log(req.cookies.jwt);
        const token = req.cookies.jwt;

        if(!token) {
            return res.status(401).json({ message: "Hey, you! You need to be logged in first to access. No exceptions! 🚫" });
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({ message: "Oops! Unauthorized - Invalid token. Are you sure you have the right key? 🚪" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if(!user) {
            return res.status(404).json({ message: "Oops! User not found. Did you forget who you are? 🤨" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protectRoute", error.message);
        res.status(500).json({ message: "Internal server error. The server must be having a bad day. 😅" });
    }
}