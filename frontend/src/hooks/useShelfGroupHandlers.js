export const useShelfGroupHandlers = ({
	token,
	newShelfGroupData,
	setShelfGroups,
	setAddShelfGroupPopupVisible
}) => {
	// Handle Add Shelf Group
	const handleAddShelfGroupSubmit = (e) => {
		e.preventDefault();

		fetch("http://localhost:8080/api/shelf-groups", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(newShelfGroupData),
		})
			.then((res) => res.json())
			.then((group) => {
				setShelfGroups((prevGroups) => [...prevGroups, group]);
				setAddShelfGroupPopupVisible(false);
			})
			.catch((error) => console.error("Error adding shelf group:", error));
	};
	return { handleAddShelfGroupSubmit };
};