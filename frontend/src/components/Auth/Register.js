import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    name: "",
    login: "",
    password: "",
    email: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Attempting registration with data:', registerData);
    try {
        await axios.post(
            'http://localhost:8080/api/users/register', // Updated endpoint
            registerData
        );
        console.log('Registration successful!');
        setMessage('Registered successfully! Redirecting to login...');
        setTimeout(() => navigate('/'), 100);
    } catch (error) {
        console.error('Registration failed:', error);
        setMessage('Registration failed. Please try again.');
    }
};


  return (
    <div className="auth-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={registerData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Login:</label>
          <input
            type="text"
            name="login"
            value={registerData.login}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={registerData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={registerData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>{message}</p>
      <p>
        Already have an account? <a href="/">Login</a>
      </p>
    </div>
  );
};

export default Register;
