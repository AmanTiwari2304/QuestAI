import React, { useState, useContext } from "react";
import "./Signup.css"
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      navigate("/");
    } catch (error) {
      setErr(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 signup">
      <h2 className="text-2xl mb-4">Signup</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full name" />
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" />
        <button type="submit">Signup</button>
        {err && <p className="text-red-500">{err}</p>}
      </form>
    </div>
  );
}
