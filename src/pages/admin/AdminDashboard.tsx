// src/pages/admin/AdminDashboard.tsx

import axios from "axios";
import { useEffect, useState } from "react";
import { getApiUrl } from "@/config/api";
import { useNavigate } from "react-router-dom";


export default function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [nodeForm, setNodeForm] = useState({
    nodeId: "",
    name: "",
    channelId: "",
    readApiKey: "",
  });

  const [assignForm, setAssignForm] = useState({
    nodeId: "",
    userId: "",
  });

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // ================= FETCH =================
  const fetchUsers = async () => {
    try {
      const res = await axios.get(getApiUrl("/api/admin/users"), { headers });
      setUsers(res.data.data || res.data);
    } catch (err) {
      console.error("Users fetch error:", err);
    }
  };

  const fetchNodes = async () => {
    try {
      const res = await axios.get(getApiUrl("/api/admin/nodes"), { headers });
      setNodes(res.data.data || res.data);
    } catch (err) {
      console.error("Nodes fetch error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchNodes();
  }, []);

  // ================= CREATE NODE =================
  const handleCreateNode = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(getApiUrl("/api/admin/node"), nodeForm, { headers });

      setSuccess("✅ Node created successfully");

      setNodeForm({
        nodeId: "",
        name: "",
        channelId: "",
        readApiKey: "",
      });

      await fetchNodes();

    } catch (err: any) {
      setError(err.response?.data?.message || "Error creating node");
    } finally {
      setLoading(false);
    }
  };

  // ================= ASSIGN NODE =================
  const handleAssignNode = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(getApiUrl("/api/admin/assign-node"), assignForm, {
        headers,
      });

      setSuccess("✅ Node assigned successfully");

      setAssignForm({
        nodeId: "",
        userId: "",
      });

      await fetchNodes();
      await fetchUsers();

    } catch (err: any) {
      setError(err.response?.data?.message || "Error assigning node");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">

      <div className="p-6 max-w-7xl mx-auto">

        {/* MESSAGE */}
        {error && <p className="text-red-500 mb-3">{error}</p>}
        {success && <p className="text-green-600 mb-3">{success}</p>}

        {/* USERS */}
        <h2 className="text-xl font-semibold mb-3">Users</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {users.map((u) => (
            <div key={u._id} className="bg-white p-4 rounded shadow">
              <h3 className="font-bold">{u.name}</h3>
              <p className="text-sm">{u.email}</p>
              <span className="text-xs bg-green-100 px-2 py-1 rounded">
                {u.role}
              </span>
            </div>
          ))}
        </div>

        {/* CREATE NODE */}
        <h2 className="text-xl font-semibold mb-3">Create Node</h2>
        <form
          onSubmit={handleCreateNode}
          className="grid md:grid-cols-2 gap-4 bg-white p-6 rounded shadow mb-8"
        >
          <input
            placeholder="Node ID"
            value={nodeForm.nodeId}
            onChange={(e) =>
              setNodeForm({ ...nodeForm, nodeId: e.target.value })
            }
            className="border p-2 rounded"
            required
          />

          <input
            placeholder="Node Name"
            value={nodeForm.name}
            onChange={(e) =>
              setNodeForm({ ...nodeForm, name: e.target.value })
            }
            className="border p-2 rounded"
            required
          />

          <input
            placeholder="Channel ID"
            value={nodeForm.channelId}
            onChange={(e) =>
              setNodeForm({ ...nodeForm, channelId: e.target.value })
            }
            className="border p-2 rounded"
            required
          />

          <input
            placeholder="Read API Key"
            value={nodeForm.readApiKey}
            onChange={(e) =>
              setNodeForm({ ...nodeForm, readApiKey: e.target.value })
            }
            className="border p-2 rounded"
            required
          />

          <button
            disabled={loading}
            className="col-span-2 bg-green-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Node"}
          </button>
        </form>

        {/* ASSIGN NODE */}
        <h2 className="text-xl font-semibold mb-3">Assign Node</h2>
        <form
          onSubmit={handleAssignNode}
          className="grid md:grid-cols-2 gap-4 bg-white p-6 rounded shadow mb-8"
        >
          <select
            value={assignForm.nodeId}
            onChange={(e) =>
              setAssignForm({ ...assignForm, nodeId: e.target.value })
            }
            className="border p-2 rounded"
            required
          >
            <option value="">Select Node</option>
            {nodes
              .filter((n) => !n.user)
              .map((n) => (
                <option key={n._id} value={n.nodeId}>
                  {n.nodeId} - {n.name}
                </option>
              ))}
          </select>

          <select
            value={assignForm.userId}
            onChange={(e) =>
              setAssignForm({ ...assignForm, userId: e.target.value })
            }
            className="border p-2 rounded"
            required
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>

          <button
            disabled={loading}
            className="col-span-2 bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Assigning..." : "Assign Node"}
          </button>
        </form>

        {/* NODE TABLE */}
        <h2 className="text-xl font-semibold mb-3"> All Nodes</h2>
        <div className="bg-white p-4 rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Node ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Channel</th>
                <th className="p-2">Assigned User</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((n) => (
                <tr key={n._id} className="text-center border-t">
                  <td className="p-2">{n.nodeId}</td>
                  <td className="p-2">{n.name}</td>
                  <td className="p-2">{n.channelId}</td>
                  <td className="p-2">
                    {n.user ? n.user.name : "Available"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}