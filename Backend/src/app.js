import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

const allowedOrigins = [
    'http://localhost:5173',
    'https://linked-in-iota-snowy.vercel.app'
]

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) {
            return callback(null, true)
        } else {
            return callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))

// app.use(cors({
//     origin: 'http://localhost:5173',
//     // origin: 'https://linked-in-iota-snowy.vercel.app',
//     credentials: true
// }))

app.use(express.json({
    limit: '16kb'
}))
app.use(express.urlencoded({
    extended: true,
    limit: '16kb'
}))
app.use(express.static('public'))
app.use(cookieParser())


import authRoutes from './routes/auth.route.js'
app.use('/api/auth', authRoutes)

import userRouter from './routes/user.router.js'
app.use('/api/user', userRouter)

import postRouter from './routes/post.route.js'
app.use('/api/post', postRouter)

import commentsRouter from './routes/comments.route.js'
app.use('/api/comments', commentsRouter);

import connectionRouter from './routes/connection.route.js'
app.use('/api/connections', connectionRouter)

import notificationRouter from './routes/notification.route.js'
app.use('/api/notifications', notificationRouter)


export { app }