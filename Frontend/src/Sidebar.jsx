import "./SideBar.css"
import { MyContext } from "./MyContext.jsx"
import { useContext, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { useNavigate } from "react-router-dom"

// ✅ API Base URL from env (fallback to localhost if not found)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

export default function Sidebar() {
    const {
        allThreads, setAllThreads, currThreadId,
        setNewChat, setPrompt, setReply,
        setCurrThreadId, setPrevChats
    } = useContext(MyContext)

    // ✅ Fetch all threads
    const getAllThreads = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/thread`)
            const res = await response.json()
            const filteredData = res.map(thread => ({
                threadId: thread.threadId,
                title: thread.title
            }))
            setAllThreads(filteredData)
        } catch (error) {
            console.log("Error fetching threads:", error)
        }
    }

    useEffect(() => {
        getAllThreads()
    }, [currThreadId])

    // ✅ Create new chat
    const createNewChat = async () => {
        setNewChat(true)
        setPrompt("")
        setReply(null)
        setCurrThreadId(uuidv4())
        setPrevChats([])
    }

    // ✅ Change thread
    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId)
        try {
            const response = await fetch(`${API_BASE_URL}/api/thread/${newThreadId}`)
            const res = await response.json()
            console.log(res)
            setPrevChats(res)
            setNewChat(false)
            setReply(null)
        } catch (error) {
            console.log("Error changing thread:", error)
        }
    }

    // ✅ Delete thread
    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/thread/${threadId}`, {
                method: "DELETE"
            })
            const res = await response.json()
            console.log(res)

            // update state after delete
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId))

            // if deleted chat is open → create new
            if (threadId === currThreadId) {
                createNewChat()
            }
        } catch (error) {
            console.log("Error deleting thread:", error)
        }
    }

    const navigate = useNavigate()

    return (
        <section className="sidebar">
            {/* new chat button */}
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo" />
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            {/* chat history */}
            <ul className="history">
                {allThreads?.map((thread, idx) => (
                    <li
                        key={idx}
                        onClick={() => changeThread(thread.threadId)}
                        className={thread.threadId === currThreadId ? "highlighted" : ""}
                    >
                        {thread.title}
                        <i
                            className="fa-solid fa-trash"
                            onClick={(event) => {
                                event.stopPropagation()
                                deleteThread(thread.threadId)
                            }}
                        ></i>
                    </li>
                ))}
            </ul>

            {/* sign */}
            <div className="sign">
                <h5>Aman Tiwari</h5>
                <button
                    className="upgradeBtn"
                    onClick={() => navigate("/pricing")}
                >
                    Upgrade
                </button>
            </div>
        </section>
    )
}
