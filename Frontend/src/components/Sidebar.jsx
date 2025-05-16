import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const role = jwtDecode(localStorage.getItem("token")).role;

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">WaveNet Admin</h2>
      <h2 className="text-xl font-semibold">Role: {role}</h2>

      <nav className="flex flex-col space-y-4">
        <Link to="/dashboard" className="hover:text-yellow-300">
          🏠 Dashboard
        </Link>
        <Link to="/users" className="hover:text-yellow-300">
          👥 Users
        </Link>
        <Link to="/invoices" className="hover:text-yellow-300">
          📄 Invoices
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto bg-red-600 py-2 px-4 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
