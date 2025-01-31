import React from "react";

const EditShelfGroupPopup = ({ newShelfGroupData, setNewShelfGroupData, handleEditShelfGroupSubmit, setEditShelfGroupPopupVisible }) => {
	return (
		<form className="add-shelf-group-popup" onSubmit={handleEditShelfGroupSubmit}>
			<label>
				Shelf Group Name:
				<input
					type="text"
					name="name"
					value={newShelfGroupData.name}
					onChange={(e) => setNewShelfGroupData({ ...newShelfGroupData, name: e.target.value })}
					required
				/>
			</label>
			<button type="submit">Edit Shelf Group</button>
			<button type="button" onClick={() => setEditShelfGroupPopupVisible(false)}>
				Cancel
			</button>
		</form>
	);
};

export default EditShelfGroupPopup;
