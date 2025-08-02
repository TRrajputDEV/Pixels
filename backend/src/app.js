import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import morgan from 'morgan';
// making the server here from express

const app = express();
app.use(morgan('combined'));

// setting up the CORS configration so we can have the URI setup for API request Acceptance.
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
// here we are setting the config of what and how much data we gonna get and how..
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
// we are using here app.use as this is an configration of this app - aka CORs, 
app.use(cookieParser())

// routes - seggrigation of file
import userRouter from './routes/user.routes.js'


//routes declaration
app.use("/api/v1/users", userRouter)

export {app} 
