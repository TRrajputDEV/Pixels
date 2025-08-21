import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import morgan from 'morgan';
import fs from 'fs';

const app = express();
app.use(morgan('combined'));

// Ensure temp directory exists
const tempDir = './public/temp';
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
    console.log('✅ Created temp directory:', tempDir);
} else {
    console.log('✅ Temp directory exists:', tempDir);
}

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// ❌ REMOVE THESE GLOBAL LINES - THEY CAUSE THE PROBLEM
// app.use(express.json({ limit: "10mb" }))
// app.use(express.urlencoded({ extended: true, limit: "10mb" }))

app.use(express.static("public"))
app.use(cookieParser())

// Routes - they will handle their own JSON parsing
import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import commentRouter from './routes/comment.routes.js'
import likeRouter from './routes/like.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'

app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)

export { app }
