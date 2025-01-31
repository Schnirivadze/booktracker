export const useShelfHandlers = ({
	token,
	newShelfData,
	setShelvesByGroup,
	setAddShelfPopupVisible,
	setEditShelfPopupVisible
}) => {
	// Handle Add Shelf
	const handleAddShelfSubmit = (e) => {
		e.preventDefault();

		fetch("http://localhost:8080/api/shelves", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(newShelfData),
		})
			.then((res) => res.json())
			.then((shelf) => {
				setShelvesByGroup((prevShelves) => ({
					...prevShelves,
					[shelf.shelfGroupId]: [...(prevShelves[shelf.shelfGroupId] || []), shelf],
				}));
				setAddShelfPopupVisible(false);
			})
			.catch((error) => console.error("Error adding shelf:", error));
	};

	// Handle Edit Shelf
	const handleEditShelfSubmit = (e) => {
		e.preventDefault();
		console.info("Editing shelf:", newShelfData);

		if (!newShelfData.id) {
			console.error("No shelf ID provided for update");
			return;
		}

		// PUT request to update the shelf
		fetch(`http://localhost:8080/api/shelves/${newShelfData.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(newShelfData),
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error(`Failed to update shelf: ${res.statusText}`);
				}
				return res.json();
			})
			.then((updatedShelf) => {
				setShelvesByGroup((prevShelves) => ({
					...prevShelves,
					[updatedShelf.shelfGroupId]: prevShelves[updatedShelf.shelfGroupId].map((shelf) =>
						shelf.id === updatedShelf.id ? updatedShelf : shelf
					),
				}));

				setEditShelfPopupVisible(false)
			})
			.catch((error) => console.error("Error updating shelf:", error));
	};

	// Handle Delete Shelf
	const handleDeleteShelf = (shelfId) => {
		const confirmation = window.confirm("Are you sure you want to delete this shelf?");
		if (!confirmation) return;

		fetch(`http://localhost:8080/api/shelves/${shelfId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then(() => {
				setShelvesByGroup((prevShelves) => {
					const updatedShelves = { ...prevShelves };
					for (const groupId in updatedShelves) {
						updatedShelves[groupId] = updatedShelves[groupId].filter(
							(shelf) => shelf.id !== shelfId
						);
					}

					return updatedShelves;
				});
			})
			.catch((error) => {
				console.error("Error deleting shelf:", error);
				alert("Failed to delete the shelf. Please try again.");
			});
	};

	return { handleAddShelfSubmit, handleEditShelfSubmit, handleDeleteShelf };
};