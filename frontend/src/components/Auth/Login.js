import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const Login = () => {
  const [loginData, setLoginData] = useState({ login: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext); // Use AuthContext to manage the token

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log('Attempting login with data:', loginData);
  //   try {
  //     const response = await axios.post(
  //       'http://localhost:8080/api/users/authenticate', // Updated endpoint
  //       loginData
  //     );
  //     const token = response.data;
  //     console.log('Login successful, token received:', token);
  //     localStorage.setItem('token', token); // Save token
  //     setMessage('Logged in successfully!');
  //     setTimeout(() => navigate('/'), 100);
  //   } catch (error) {
  //     console.error('Login failed:', error);
  //     setMessage('Invalid login or password. Please try again.');
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting login with data:", loginData);
      const response = await axios.post(
        "http://localhost:8080/api/users/authenticate",
        loginData
      );
      console.log("Login successful, token received:", response.data);
      setToken(response.data); // Store the token in context
      setMessage("Logged in successfully!");
      setTimeout(() => navigate("/dashboard"), 100);
    } catch (error) {
      console.error("Login failed:", error);
      setMessage("Invalid login or password. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Login:</label>
          <input
            type="text"
            name="login"
            value={loginData.login}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
      <p>
        Don’t have an account? <a href="/register">Sign up</a>
      </p>
    </div>
  );
};

export default Login;
