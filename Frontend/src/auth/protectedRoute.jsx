import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Sidebar from "../components/Sidebar";

const ProtectedRoute = ({ Component }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />;

  try {
    const decoded = jwtDecode(token);
    const expiry = decoded.exp * 1000;
    if (Date.now() > expiry) {
      localStorage.removeItem("token");
      return <Navigate to="/" />;
    }

    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-6 bg-gray-50 min-h-screen">
          <Component />
        </div>
      </div>
    );
  } catch (err) {
    localStorage.removeItem("token");
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
