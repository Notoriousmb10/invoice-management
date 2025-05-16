import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { jwtDecode } from "jwt-decode";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "USER",
    password: "",
    groupId: "",
  });
  const [page, setPage] = useState(1);
  const role = jwtDecode(localStorage.getItem("token")).role;


  const fetchUsers = async () => {
    try {
      const res = await API.get(`/user?page=${page}`);
      if (role === 'ADMIN') {
        res.data.users = res.data.users.filter((user) => user.role !== "SUPERADMIN");
      } else if (role === 'UNITMANAGER') {
        res.data.users = res.data.users.filter((user) => user.role !== "ADMIN" && user.role !== "SUPERADMIN");
      } else if (role === 'USER') {
        res.data.users = res.data.users.filter(
          (user) =>
            user.role !== "ADMIN" &&
            user.role !== "SUPERADMIN" &&
            user.role !== "UNITMANAGER"
        );
      }
      setUsers(res.data.users);
    } catch (err) {
      console.error(err.response?.data?.msg);
    }
  };

  useEffect(() => {
    fetchUsers();
    alert(role)
  }, [page]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/user/create", newUser);
      alert("User created successfully");
      fetchUsers();
      setNewUser({
        username: "",
        email: "",
        role: "USER",
        password: "",
        groupId: "",
      });
    } catch (err) {
      alert(err.response?.data?.msg || "Error creating user");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm(`Delete user ${userId}?`)) return;
    try {
      await API.delete(`/user/${userId}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.msg || "Delete failed");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">User Management</h1>

      <form
        onSubmit={handleCreate}
        className="space-y-3 bg-white p-4 rounded shadow mb-6"
      >
        <h2 className="text-lg font-semibold">Create New User</h2>
        <input
          type="text"
          placeholder="username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Group ID (optional)"
          value={newUser.groupId}
          onChange={(e) => setNewUser({ ...newUser, groupId: e.target.value })}
          className="border p-2 w-full"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="border p-2 w-full"
        >
          {role === "SUPERADMIN" && <option value="ADMIN">ADMIN</option>}
          {role === "ADMIN" && <option value="UNITMANAGER">UNIT MANAGER</option>}
          {role === "UNITMANAGER" && <option value="USER">USER</option>}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </form>

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">UserID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((u) => (
            <tr key={u._id}>
              <td className="border p-2">{u.userId}</td>
              <td className="border p-2">{u.username}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.role}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(u.userId)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          ⬅ Prev
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)}>Next ➡</button>
      </div>
    </div>
  );
};

export default Users;
