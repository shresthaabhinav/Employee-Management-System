import express from "express"
import cors from "cors"
import "dotenv/config"
import multer from "multer";
import connectDB from "./config/db";

const app = express()
const PORT = process.env.PORT || 4000;

// middleware 
app.use(cors())
app.use(express.json())
app.use(multer().none())

// route
app.get("/", (req, res)=> res.send("Server is running"))

await connectDB()
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))