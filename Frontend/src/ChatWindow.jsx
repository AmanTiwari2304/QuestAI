import "./ChatWindow.css"
import Chat from "./Chat.jsx"
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

export default function ChatWindow() {
    const {prompt, setPrompt, reply, 
        setReply, currThreadId, prevChats,
        setPrevChats, setNewChat} = useContext(MyContext);

    const[loading, setLoading] = useState(false);
    const[isOpen, setIsOpen] = useState(false); 

    const getReply = async () => {
        setLoading(true);
        setNewChat(false);
        console.log("Message :" ,prompt, "ThreadId :" , currThreadId )
        const options = {
            method: "POST",
            headers :{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message : prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, options)
            const res = await response.json();
            console.log(res);
            setReply(res.reply)
        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    }

    // Append new Chat to prevChats
    useEffect(() => {
        if(prompt && reply){
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                },{
                    role: "assistant",
                    content: reply
                }]
            ))
        }
        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    const navigate = useNavigate();
     
    return(
        <div className="chatWindow">
            <div className="navbar">
                <span> QuestAI <i className="fa-solid fa-chevron-down"></i></span>
                <div className="upgradePlan">
                    <button onClick={() => navigate("/pricing")}>
                        <i className="fa-solid fa-rocket"></i>
                        Upgrade Plan
                    </button>
                </div>
                <div onClick={handleProfileClick}>
                    <i className="fa-solid fa-user"></i>
                </div>
            </div>

            {
                isOpen && 
                <div className="dropDown">
                    {/* <div className="dropDownItem" onClick={() => navigate("/login")}><i class="fa-solid fa-right-to-bracket"></i>Login</div>
                    <div className="dropDownItem" onClick={() => navigate("/signup")}><i class="fa-solid fa-user-plus"></i>Sign-Up</div> */}
                    <div className="dropDownItem" ><i class="fa-solid fa-right-to-bracket"></i>Login</div>
                    <div className="dropDownItem" ><i class="fa-solid fa-user-plus"></i>Sign-Up</div>
                    <div className="dropDownItem" onClick={() => navigate("/pricing")}><i class="fa-solid fa-star-of-life"></i> Upgrade Plan</div>
                    <div className="dropDownItem"><i class="fa-solid fa-bowling-ball"></i>Personalization</div>
                    <div className="dropDownItem"><i class="fa-solid fa-gear"></i>Settings</div>
                    <div className="dropDownItem"><i class="fa-solid fa-arrow-right-from-bracket"></i>Log Out</div>
                </div>
            }
            
            <Chat/>

            {/* Loadder */}

            <ScaleLoader color="#fff" loading={loading} />


            
            {/* Input Box */}
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything" 
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                        onKeyDown={(event) => event.key === 'Enter' ? getReply() : ''} 
                    />
                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <footer className="info">
                    <p>QuestAI can make mistakes. Check important info. See Cookie Preferences.</p>
                </footer>
            </div>

            

        </div>
    )
}