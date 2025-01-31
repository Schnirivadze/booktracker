export const useShelfGroupHandlers = ({
	token,
	newShelfGroupData,
	setShelfGroups,
	setAddShelfGroupPopupVisible,
	setEditShelfGroupPopupVisible
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

	// Handle Edit Shelf Group
	const handleEditShelfGroupSubmit = (e) => {
		e.preventDefault();

		fetch(`http://localhost:8080/api/shelf-groups/${newShelfGroupData.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(newShelfGroupData),
		})
			.then((res) => res.json())
			.then((updatedGroup) => {
				setShelfGroups((prevGroups) =>
					prevGroups.map((group) =>
						group.id === updatedGroup.id ? updatedGroup : group
					)
				);
				setEditShelfGroupPopupVisible(false);
			})
			.catch((error) => console.error("Error editing shelf group:", error));
	};

	// Handle Delete Shelf Group
	const handleDeleteShelfGroup = (shelfGroupId) => {
		const confirmation = window.confirm("Are you sure you want to delete this shelf group?");
		if (!confirmation) return;

		fetch(`http://localhost:8080/api/shelf-groups/${shelfGroupId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then(() => {
				// Filter out the deleted shelf group from the state
				setShelfGroups((prevGroups) => prevGroups.filter((group) => group.id !== shelfGroupId));
				setEditShelfGroupPopupVisible(false);
			})
			.catch((error) => {
				console.error("Error deleting shelf group:", error);
				alert("Failed to delete the shelf group. Please try again.");
			});
	};


	return { handleAddShelfGroupSubmit, handleEditShelfGroupSubmit, handleDeleteShelfGroup};
};