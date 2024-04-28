import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

//signup
const signUp = asyncHandler ( async (req, res) => {
    const {username, email, password, countryCode, phoneNumber} = req.body;

    if (
        [username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All feilds are required")
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }] 
    })

    if (existingUser) {
        throw new ApiError(409, "User with email already exists")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
        countryCode,
        phoneNumber
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser) throw new ApiError(500, "internal DB error while signing user");

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User signed successfully")
    )
})

//login
const login = asyncHandler(async (req, res) => {
    const {email, username, password} = req.body;

    if (!email && !password) {
        throw new ApiError(400, "email and password required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })
    if(!user) throw new ApiError(404, "user does not exist - signup first")

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid) throw new ApiError(401, "WRONG PASSWORD");

    //tokens
    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //cookies
    const options ={
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken" , accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            { user: loggedInUser, accessToken, refreshToken},
            "User logged in successfully"
        )
    )
})

//logout
const logout = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})


export {
    signUp,
    login,
    logout,
}