import "./Chat.css"
import { useContext, useState, useEffect } from "react"
import { MyContext } from "./MyContext.jsx";
import ReactMarkdown from 'react-markdown';
// import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from 'rehype-highlight';
import "highlight.js/styles/github-dark.css"

export default function Chat() {
    const{newChat, prevChats, reply} = useContext(MyContext)
    const[latestReply, setLatestReply] = useState(null);
    
    useEffect( () => {
        if(reply === null){
            setLatestReply(null);
            return 
        }
        if(!prevChats?.length) return;

        const content = reply.split(" "); // split our reply into words -> individual words
        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx+1).join(" "));
            idx++;
            if(idx >= content.length) clearInterval(interval);
        }, 40)// 40 millisecond of time 

        return () => clearInterval(interval)
    }, [prevChats, reply])
    return(
        <div>
            {newChat && <h1>What's on the agenda today?</h1>}
            <div className="chats">
                {
                    prevChats?.slice(0, -1).map((chat, idx) => 
                        <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
                            {
                                chat.role === "user" ? 
                                <p className="userMessage">{chat.content}</p> :
                                <ReactMarkdown 
                                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                                    // remarkPlugins={[remarkGfm]}
                                >
                                    {chat.content}
                                </ReactMarkdown> 
                                // <p className="gptMessage">{chat.content}</p>

                            }
                        </div>
                    )
                }

                {
                    prevChats.length > 0 && latestReply !== null &&
                    <div className="gptDiv" key={"typing"}>
                        <ReactMarkdown 
                            rehypePlugins={[rehypeHighlight, rehypeRaw]}  
                            // remarkPlugins={[remarkGfm]}
                        >
                            {latestReply}
                        </ReactMarkdown>
                    </div>
                }

                {
                    prevChats.length > 0 && latestReply === null &&
                    <div className="gptDiv" key={"non-typing"}>
                        <ReactMarkdown 
                            rehypePlugins={[rehypeHighlight, rehypeRaw]}
                            // remarkPlugins={[remarkGfm]}
                        >
                            {prevChats[prevChats.length-1].content}
                        </ReactMarkdown>
                    </div>
                }






                {/* <div className="userDiv">
                    <p className="userMessage">User Message</p>
                </div>
                <div className="gptDiv">
                    <p className="gptMessage">Reply from OpenAI</p>
                </div> */}
            </div>
        </div>
    )
}