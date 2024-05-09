import mongoose from "mongoose";
import axios from "axios"
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

//Generate Tokens
const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

//signup
const signUp = asyncHandler(async (req, res) => {
    const { username, email, password, countryCode, phoneNumber } = req.body;
    if (
        [username, email, password, countryCode].some((field) => typeof field !== 'string' || field.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    if (!phoneNumber) {
        throw new ApiError(400, "Phone Number is required");
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) {
        throw new ApiError(409, "User with email already exists")
    }

    const user = await User.create({
        username,
        email,
        password,
        countryCode,
        phoneNumber
    })

    // Handle SubUser Creation
    try {
        const subUserPayload = {
            label: user._id, // Using the created user's ID as the label
            sticky_range: {
                start: 11000,
                end: 20000
            },
            threads: 100
        };

        // Make request to third-party API to create subuser
        const subUserResponse = await axios.post('https://api.dataimpulse.com/reseller/sub-user/create', subUserPayload, {
            headers: {
                'Authorization': `Bearer ${process.env.DATAIMPULSE_TOKEN}`
            }
        });

        console.log('Subuser created successfully:', subUserResponse.data);

        // Update user document with the subuser ID
        await User.findByIdAndUpdate(user._id, { subuserId: subUserResponse.data.id });

    } catch (error) {
        // Handle error when calling third-party API
        console.error("Error creating sub-user, re-check token validity: ", error);
        //handle this error according to your application's logic
    }

    //fetch created user details to send response
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    console.log("new user: ", createdUser)

    if (!createdUser) throw new ApiError(500, "internal DB error while signing user");

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User signed successfully")
    )
})

//login
const login = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!email && !password) {
        throw new ApiError(400, "email and password required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) throw new ApiError(404, "user does not exist - signup first")

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        console.log("isPasswordvalid: ", isPasswordValid)
        throw new ApiError(401, "WRONG PASSWORD");
    }

    //Generate User's tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    //Third Party Token (dataimpulse)
    const thirdPartyApiToken = await axios.post('https://api.dataimpulse.com/reseller/user/token/get',
        {
            login: `${process.env.TOKEN_LOGIN_EMAIL}`,
            password: `${process.env.TOKEN_LOGIN_PASSWORD}`
        }
    );

    const dataimpulseToken = thirdPartyApiToken.data.token; // Extract the token from the response


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    // Set the third-party token in the response headers
    res.setHeader('X-Data-Impulse-Token', dataimpulseToken);

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        )
})

//logout
const logout = asyncHandler(async (req, res) => {
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

//Refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) throw new ApiError(401, "unauthorized request");

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) throw new ApiError(401, "Invalid refresh token");

        if (incomingRefreshToken !== user?.refreshToken) throw new ApiError(401, "Refresh token is expired or used");

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

//Change Password
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})


export {
    signUp,
    login,
    logout,
    refreshAccessToken,
    changeCurrentPassword,
}