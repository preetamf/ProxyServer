import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            minlength: 2,
            maxlength: 255,
            required: true,
            lowercase: true,
            description: 'User\'s full name'
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            description: 'User\'s email address',
            validate: {
                validator: (v) => /\S+@\S+\.\S+/.test(v),
                message: props => `${props.value} is not a valid email format!`
            }
        },
        countryCode: {
            type: String,
            pattern: /^[A-Z]{2}$/,
            required: true,
            description: 'User\'s country code (ISO 3166-1 alpha-2)'
        },
        phoneNumber: {
            type: Number,
            minlength: 9,
            maxlength: 15,
            required: true,
            description: 'User\'s phone number (without special characters)'
        },
        password: {
            type: String,
            minlength: 8,
            required: true,
            writeOnly: true,
            description: 'User\'s password (hashed and never stored in plain text)'
        },
        refreshToken: {
            type: String,
            description: 'User\'s refresh token (for access token renewal)'
        }
    },
    {
        timestamps: true
    }
);

//password hash
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();

        this.password = await bcrypt.hash(this.password, 10);
        next()
    } catch (error) {
        console.log("error while password hashing: ", error)
    }

})

//password validation after hashing
userSchema.methods.isPasswordCorrect = async function (password) { 
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        console.log("Password incorrect while compare: ", error)
    }
}

//Generate token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        //payload
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET, //secret key
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userSchema)