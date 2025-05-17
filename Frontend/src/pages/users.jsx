import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { jwtDecode } from "jwt-decode";

const Users = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const role = decoded.role;
  const [newUser, setNewUser] = useState({
  username: "",
  email: "",
  role: role === "SUPERADMIN"
    ? "ADMIN"
    : role === "ADMIN"
    ? "UNITMANAGER"
    : role === "UNITMANAGER"
    ? "USER"
    : "",
  password: "",
  groupId: "",
});
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [editRole, setEditRole] = useState("");

  
  
  
  const myUserId = decoded.userId;

  const fetchUsers = async () => {
    try {
      const res = await API.get(`/user?page=${page}`);
      
      if (role === "ADMIN") {
        res.data.users = res.data.users.filter((user) => user.role !== "SUPERADMIN");
      } else if (role === "UNITMANAGER") {
        res.data.users = res.data.users.filter(
          (user) => user.role !== "ADMIN" && user.role !== "SUPERADMIN"
        );
      } else if (role === "USER") {
        res.data.users = res.data.users.filter(
          (user) =>
            user.role !== "ADMIN" &&
            user.role !== "SUPERADMIN" &&
            user.role !== "UNITMANAGER"
        );
      }
      setUsers(res.data.users);
      console.log(res.data.users);
      console.log(myUserId)
    } catch (err) {
      console.error(err.response?.data?.msg);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      console.log(newUser);
      await API.post("/user/create", newUser);
      alert("User created successfully");
      fetchUsers();
      setNewUser({
        username: "",
        email: "",
        role: "",
        password: "",
        groupId: "",
      });
    } catch (err) {
      alert(err.response?.data?.msg || "Error creating user");
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.userId);
    setEditRole(user.role);
  };

  const handleEditRoleChange = (e) => {
    setEditRole(e.target.value);
  };

  const handleUpdate = async (userId) => {
    try {
      await API.patch("/user/update-role", { userId, newRole: editRole });
      alert("User updated");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.msg || "Update failed");
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
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
     <div className="min-h-screen bg-gray-100 pl-64 flex">
    <div className="flex-1 max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">👥 User Management</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">➕ Create New User</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="text"
              placeholder="Group ID (optional)"
              value={newUser.groupId}
              onChange={(e) => setNewUser({ ...newUser, groupId: e.target.value })}
              className="border border-gray-300 p-2 rounded"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="border border-gray-300 p-2 rounded"
            >
              {role === "SUPERADMIN" && <option value="ADMIN">ADMIN</option>}
              {role === "ADMIN" && <option value="UNITMANAGER">UNITMANAGER</option>}
              {role === "UNITMANAGER" && <option value="USER">USER</option>}
            </select>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded col-span-1 md:col-span-2"
            >
              Create User
            </button>
          </form>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 text-left">User ID</th>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users
                ?.filter((u) => u._id != myUserId)
                .map((u) =>
                  editingUser === u.userId ? (
                    <tr key={u._id} className="bg-yellow-50">
                      <td className="p-3">{u.userId}</td>
                      <td className="p-3">{u.username}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">
                        <select
                          value={editRole}
                          onChange={handleEditRoleChange}
                          className="border p-1 rounded"
                        >
                          {role === "SUPERADMIN" && (
                            <>
                              <option value="ADMIN">ADMIN</option>
                              {/* <option value="UNITMANAGER">UNIT MANAGER</option> */}
                              {/* <option value="USER">USER</option> */}
                            </>
                          )}
                          {role === "ADMIN" && (
                            <>
                              <option value="UNITMANAGER">UNIT MANAGER</option>
                              {/* <option value="USER">USER</option> */}
                            </>
                          )}
                        </select>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleUpdate(u.userId)}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="p-3">{u.userId}</td>
                      <td className="p-3">{u.username}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.role}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleEditClick(u)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(u.userId)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          >
            ⬅ Prev
          </button>
          <span className="text-gray-600">Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            className="bg-gray-300 px-3 py-1 rounded"
          >
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
