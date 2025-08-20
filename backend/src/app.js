import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import morgan from 'morgan';
// making the server here from express
// 'http://localhost:5173'
const app = express();
app.use(morgan('combined'));

// setting up the CORS configration so we can have the URI setup for API request Acceptance.
// backend/src/app.js
const corsOptions = {
    origin: 'https://watchpixels.onrender.com/',  // Your exact Netlify URL
    credentials: true,  // CRITICAL: Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// here we are setting the config of what and how much data we gonna get and how..
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
// we are using here app.use as this is an configration of this app - aka CORs, 
app.use(cookieParser())

// routes - seggrigation of file
import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import commentRouter from './routes/comment.routes.js'
import likeRouter from './routes/like.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter) 
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)

export {app} 
