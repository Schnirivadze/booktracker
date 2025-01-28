export const useShelfHandlers = ({
    token,
    newShelfData,
    setShelvesByGroup,
    setAddShelfPopupVisible
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
    return {handleAddShelfSubmit};
};