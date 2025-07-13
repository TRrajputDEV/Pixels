import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async (req, res) => {
    /* steps for this Register controllers
        1. Get user details from the user.
        2. Validation - Not Empty.
        3. Check if user already Exits: Username and email.
        4. check for images, check for  avatar [ompulsary].
        5. upload the images to cloudinary.
        6. create user object - Nosql, Create Entry in DB.
        7. Remove Password and Refresh token field from response.
        8. Check for User Creation.
        9. return the response.
    */

    /* We can have data from req.body as well and from the URI as well*/

    const { fullname, email, username, password } = req.body
    console.log("fullname: ", fullname, ": ", email)

    /* Some advance shit here - if stat. free*/

    if (
        [fullname, email, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required.")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User With email or Username already Exits.")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400,
            "Avatar file is required."
        )
    }

    // const avatar = await uploadOnCloudinary(avatarLocalPath)
const avatar = await uploadOnCloudinary(avatarLocalPath);
if (!avatar?.url) {
    throw new ApiError(400, "Failed to upload avatar to cloudinary.");
}

let coverImageUrl = "";
if (coverImageLocalPath) {
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (coverImage?.url) {
        coverImageUrl = coverImage.url;
    }
}

const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImageUrl,
    email,
    password,
    username: username.toLowerCase(),
});


    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong during registeration")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )




})

export { registerUser }
