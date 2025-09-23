import express from "express";
import Thread from "../models/thread.js";
import getOpenAiApiResponse from "../Utils/openAi.js";

const router = express.Router();

router.post("/test", async(req, res) => {
    try {
        const thread = new Thread({
            threadId : "dsfajks",
            title: "Testing New Thread"

        });
        const response = await thread.save();
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "Failed to save in DB"});
    }
})

router.get("/thread", async (req, res) => {
    try {
        const allThreads = await Thread.find({}).sort({updated: -1});
        // descending order of updatedAt...most recent data on top
        res.json(allThreads);
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "Failed to fetch thread"});
    }
})

router.get("/thread/:threadId" , async (req, res) => {
    const {threadId} = req.params;
    try {
        const thread = await Thread.findOne({threadId});
        if(!thread){
            res.status(404).json({error : "Thread not found"})
        }
        res.json(thread.messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "Failed to fetch chat"});
    }
})

router.delete("/thread/:threadId", async (req, res) => {
    const {threadId} = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({threadId});
        if(!deletedThread){
            res.status(404).json({error: "Thread not found"})
        }
        res.status(200).json({success: "Succesfully deleted your chat"})
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "Failed to delete"});
    }
})

router.post("/chat", async (req, res) => {
    const {threadId, message} = req.body;
    if(!threadId || !message){
        return res.status(404).json({error : "Missing required fields"})
    }
    try {
        let thread = await Thread.findOne({threadId});
        if (!thread) {
            // create a new thread in Database
            thread = new Thread({
                threadId,
                title: message,
                messages: [{role :"user", content: message}]
            })
        } else {
            thread.messages.push({role: "user", content:message})
        }

        const assistantReply = await getOpenAiApiResponse(message);

        thread.messages.push({role: "assistant", content : assistantReply});
        thread.updatedAt = new Date();

        await thread.save()
        res.json({reply : assistantReply});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "Failed to fetch chat"});
    }
})

export default router;