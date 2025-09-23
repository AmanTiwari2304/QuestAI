import "./SideBar.css"
import { MyContext } from "./MyContext.jsx"
import { useContext, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
    const{allThreads, setAllThreads, currThreadId, 
        setNewChat, setPrompt, setReply, 
        setCurrThreadId, setPrevChats} = useContext(MyContext)

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread")
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId : thread.threadId, title: thread.title}));

            // threadId, title -> are the only required parameter for sidebar
            // console.log(filteredData);
            setAllThreads(filteredData)
        } catch(error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllThreads();
    },[currThreadId])

    const createNewChat = async() => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv4());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`)
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {method : "DELETE"})
            const res = await response.json();
            console.log(res);
            
            // updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            // if we delete the open chat message 
            if(threadId === currThreadId){
                createNewChat();
            }
        } catch (error) {
            console.log(error)
        }
    }

    const navigate = useNavigate();

    return(
        <section className="sidebar">
            {/* new chat button */}
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"/>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

        
            {/* chat history */}
            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx}
                            onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted" : " "}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(event) => {
                                    event.stopPropagation(); 
                                    // stop event bubbling - (only work for delete button not for message button)
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
                
                
            </ul>

            {/* sign */}
            <div className="sign">
                <h5>Aman Tiwari</h5>
                <button className="upgradeBtn" 
                        onClick={() => navigate("/pricing")}>Upgrade</button>
                
            </div>
        </section>
    )
}