import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './env' // dotenv config setup bro there is this as it will fetch this env and all...
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port ${process.env.PORT}`)
    });
})
.catch((err)=>{
    console.log("MongoDB connectionn failed !!!", err)
})
