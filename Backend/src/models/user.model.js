import { Schema } from "mongoose"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    profileImage: {
        type: String, // cloudnary url
    },
    coverImage: {
        type: String // cloudnairy url
    },
    headLine: {
        type: String,
        default: ""
    },
    skills: [{
        type: String
    }],
    education: [
        {
            college: {
                type: String,
            },
            degree: {
                type: String,
            },
            fieldOfStudy: {
                type: String
            }
        }
    ],
    location: {
        type: String
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    experience: [
        {
            title: { type: String },
            company: { type: String },
            description: { type: String }
        }
    ],
    connections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
},
    { timestamps: true }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 8)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id },
        process.env.TOKEN_SECRET,
        { expiresIn: '24h' }
    )
}

const User = mongoose.model('User', userSchema)

export default User