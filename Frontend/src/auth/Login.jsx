import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
const jwtDecode = require("jwt-decode");

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
        timezone,
      });
      localStorage.setItem("token", res.data.token);
      const role = jwtDecode(res.data.token).role;
      navigate("/dashboard", { state: { role } });
    } catch (err) {
      console.error(err);
      alert("Invalid credentials");
    }
  };
  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow w-96 space-y-4"
      >
        <h2 className="text-xl font-bold">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
