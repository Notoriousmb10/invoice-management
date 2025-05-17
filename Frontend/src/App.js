import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
// import Dashboard from "./pages/dashboard";
import Users from "./pages/users";
import Invoices from "./pages/invoices";
import ProtectedRoute from "./auth/protectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* <Route path="/dashboard" element={<ProtectedRoute Component={Dashboard} />} /> */}
        <Route path="/users" element={<ProtectedRoute Component={Users} />} />
        <Route path="/invoices" element={<ProtectedRoute Component={Invoices} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
