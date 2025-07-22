import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5030/api/auth/register",
        form
      );

      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
      console.log(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-base-100 shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block mb-1 text-sm text-gray-600"
          >
            Username
          </label>
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
            placeholder="Enter username"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 text-sm text-gray-600">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
            placeholder="Enter email"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-1 text-sm text-gray-600"
          >
            Password
          </label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
            placeholder="Enter password"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full mb-4">
          Register
        </button>
      </form>

      <p className="text-sm text-center">
        Already have an account?{" "}
        <a href="/login" className="text-primary hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}
