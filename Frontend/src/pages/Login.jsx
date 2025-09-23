import React, { useState, useContext } from "react";
import "./Login.css"
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
        console.log(error);
      setErr(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 login">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" />
        <button type="submit">Login</button>
        {err && <p className="text-red-500">{err}</p>}
      </form>
    </div>
  );
}
