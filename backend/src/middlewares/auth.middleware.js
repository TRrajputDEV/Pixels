import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js";

export const VerifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Get token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        console.log("Token received:", token ? "Token exists" : "No token");
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request - No token provided")
        }

        // Verify the token
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            console.log("Token decoded successfully:", decodedToken._id);
        } catch (jwtError) {
            console.log("JWT verification error:", jwtError.message);
            throw new ApiError(401, "Invalid access token - Token verification failed")
        }

        // Find user by decoded token ID
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        
        if (!user) {
            throw new ApiError(401, "Invalid access token - User not found")
        }

        // Attach user to request object
        req.user = user;
        next()
        
    } catch (error) {
        // Don't mask the original error if it's already an ApiError
        if (error instanceof ApiError) {
            throw error;
        }
        
        // For any other unexpected errors
        console.error("Auth middleware unexpected error:", error);
        throw new ApiError(401, `Authentication failed: ${error.message}`)
    }
})