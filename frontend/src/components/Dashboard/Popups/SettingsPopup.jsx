
import React, { useState, useEffect } from "react";
const SettingsPopup = ({
	userData,
	setNewUserData,
	handleEditUserSubmit,
	setSettingsPopupVisible,
}) => {

	// Local state to manage changes
	const [formData, setFormData] = useState(userData);

	// Update formData whenever userData changes (props update)
	useEffect(() => {
		setFormData(userData);
	}, [userData]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		handleEditUserSubmit(formData);
	};

	return (
		<form className="settings-popup" onSubmit={handleSubmit}>
			<b>Settings</b>
			<label>Username
				<input
					type="text"
					name="name"
					value={formData.name}
					onChange={handleInputChange}
					required
				/>
			</label>
			<label>Login
				<input
					type="text"
					name="login"
					value={formData.login}
					onChange={handleInputChange}
					required
				/>
			</label>
			<label>Password
				<input
					type="password"
					name="password"
					value={formData.password || ""}
					onChange={handleInputChange}
				/>
			</label>
			<label>Email
				<input
					type="email"
					name="email"
					value={formData.email}
					onChange={handleInputChange}
					required
				/>
			</label>
			<button>Save changes</button>
			<button type="button" onClick={() => setSettingsPopupVisible(false)}>Cancel</button>
		</form>
	);
};

export default SettingsPopup;
