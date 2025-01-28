import React, { createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(null);
	const [user, setUser] = useState(null);
	//   const navigate = useNavigate();

	// Fetch user info when token changes
	useEffect(() => {
		if (token) {
			console.log("Fetching user info...");
			fetch("http://localhost:8080/api/users/info", {
				headers: { Authorization: `Bearer ${token}` },
			})
				.then((response) => {
					if (response.ok) return response.json();
					throw new Error("Failed to fetch user info");
				})
				.then((data) => {
					console.log("User info fetched:", data);
					setUser(data);
				})
				.catch((error) => {
					console.error(error);
					handleLogout();
				});
		}
	}, [token]);

	const handleLogout = () => {
		setToken(null);
		setUser(null);
		// navigate("/login");
	};

	return (
		<AuthContext.Provider value={{ token, setToken, user, handleLogout }}>
			{children}
		</AuthContext.Provider>
	);
};
