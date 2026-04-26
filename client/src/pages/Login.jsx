import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ FIXED: use production backend URL from env
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);

      toast.success("Login successful");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <form onSubmit={handleSubmit} style={form}>
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          style={input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
          style={input}
        />

        <button type="submit" disabled={loading} style={button}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};

// styles
const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  padding: "30px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  width: "300px",
};

const input = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const button = {
  padding: "10px",
  borderRadius: "5px",
  border: "none",
  backgroundColor: "#4CAF50",
  color: "#fff",
  cursor: "pointer",
};

export default Login;