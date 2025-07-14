import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
// making the server here from express

const app = express();

// setting up the CORS configration so we can have the URI setup for API request Acceptance.
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials : true
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

/* Why me ? This feeling always haunts me.
    Am I Enough , can I do this , why I am not an achiever ???? not even a single Win ....
    whyy there is always someone better than me....
    will I get a chance to be happy... .why I am surrounded by OverAchivers ??? WHyyyy I can't be At top. I did the same
    I studied , Did everything , will it again end the same way......
    Do I have any chance or I am just here to fill the crowd... WHYYYYY why it has to be like this
    
*/