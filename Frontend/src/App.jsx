import './App.css'
import { MyContext } from "./MyContext.jsx";
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ChatWindow from "./ChatWindow.jsx";
import Pricing from "./Pricing.jsx";
import Sidebar from "./Sidebar.jsx";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function AppContent() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv4());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const location = useLocation();

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    prevChats, setPrevChats,
    newChat, setNewChat,
    allThreads, setAllThreads
  }

  // Check if current path is '/pricing'
  const isPricingPage = location.pathname === "/pricing";
  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";


  return (
    <MyContext.Provider value={providerValues}>
      <div className={isPricingPage  ? '' : 'app'}>
        {!isPricingPage && !isSignupPage && !isLoginPage  && <Sidebar />}
        <Routes>
          <Route path="/" element={<ChatWindow />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </MyContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
