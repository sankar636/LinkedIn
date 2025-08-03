import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json({
    limit:'16kb'
}))
app.use(express.urlencoded({
    extended: true,
    limit:'16kb'
}))

app.use(express.static('public'))

app.use(cookieParser())

import authRoutes from './routes/auth.route.js'
app.use('/api/auth', authRoutes)

import userRouter from './routes/user.router.js'
app.use('/api/user', userRouter)

export { app }