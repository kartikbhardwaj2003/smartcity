import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [name, setName] = useState("New User");
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState("OPERATOR");
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, password, role });
      alert("Registered. Please login.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <form onSubmit={submit} className="space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full p-2 border rounded" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-2 border rounded" />
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded">
            <option value="ADMIN">ADMIN</option>
            <option value="OPERATOR">OPERATOR</option>
            <option value="VIEWER">VIEWER</option>
          </select>
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Create account</button>
        </form>
      </div>
    </div>
  );
}
