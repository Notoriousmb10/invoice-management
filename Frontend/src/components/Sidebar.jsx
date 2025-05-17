import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "./logo.png";
const Sidebar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = jwtDecode(token).role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-64 bg-[#02325A] text-white flex flex-col shadow-lg z-50 mr-10"
    >
      <div className="p-6 border-b border-gray-700 flex flex-col items-center gap-3">
        <img
          src={logo}
          alt="WaveNet Logo"
          className="w-60 h-10 object-contain"
        />
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-400">Role:</p>
          <p className="text-md font-medium text-white">{role}</p>
        </div>
      </div>

      <nav className="flex flex-col p-4 gap-4 flex-grow">
        <Link
          to="/users"
          className="text-white hover:bg-gray-800 px-4 py-2 rounded transition duration-200"
        >
          👥 Manage Users
        </Link>
        <Link
          to="/invoices"
          className="text-white hover:bg-gray-800 px-4 py-2 rounded transition duration-200"
        >
          📄 Manage Invoices
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-200"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
