import express from "express";
import 'dotenv/config';
import cors from 'cors';
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from './routes/authRoutes.js';
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "path";

// your API routes first
// app.use("/api/...", require("./routes/..."));


// serve frontend build
const app = express();
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});


const PORT = 8080;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());
// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true
// }));

app.use("/api", chatRoutes);
app.use('/api/auth', authRoutes);

const connectDB = async () => {
    try {
       await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connected")
    } catch (error) {
        console.log("Failed to connect with DB", error)
    }
}

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
    connectDB();
})

// app.post("/test", async(req, res) => {
//     const options = {
//         method : "POST",
//         headers : {
//            "Content-Type" : "application/json",
//            "Authorization" : `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages: 
//             [{
//                 role: "user",
//                 content: req.body.message
//             },]
//         })
        
//     }

//     try {
//         const response = await fetch("https://api.openai.com/v1/chat/completions", options)
//         const data = await response.json();
//         // console.log(data.choices[0].message.content);
//         res.send(data.choices[0].message.content); //reply by openai
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({ error: "Internal Server Error" });
//     }
// })



// USE THIS WHEN USING npm i openai :-

// import OpenAI from 'openai';
// import 'dotenv/config';

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, 
// });

// const response = await client.responses.create({
//   model: 'gpt-4o-mini',
//   input: 'Joke related to human',
// });

// console.log(response.output_text);