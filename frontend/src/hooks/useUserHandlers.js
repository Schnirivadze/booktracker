
export const useUserHandlers = ({
	token,
	newUserData, 
	setUser,
	setSettingsPopupVisible,
	navigate
}) => {

	const handleEditUserSubmit = (e) => {
	
		if (!newUserData.id) {
			console.error("No User ID provided for update");
			return;
		}
	
		// PUT request to update the User
		fetch(`http://localhost:8080/api/users/update`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(newUserData),
		})
		.then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to update User: ${res.statusText}`);
			}
			return res.text(); // Return text instead of JSON since the backend sends a string
		})
		.then((message) => {
			console.info(message); 
	
			alert(message); 
	
			setSettingsPopupVisible(false);
			navigate("/"); 
		})
		.catch((error) => {
			console.error("Error updating User:", error);
			alert("Failed to update the user. Please try again.");
		});
	};
	



	return { handleEditUserSubmit };
};