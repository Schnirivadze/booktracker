import React from "react";

const AddShelfGroupPopup = ({ newShelfGroupData, setNewShelfGroupData, handleAddShelfGroupSubmit, setAddShelfGroupPopupVisible }) => {
	return (
		<form className="add-shelf-group-popup" onSubmit={handleAddShelfGroupSubmit}>
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
			<button type="submit">Add Shelf Group</button>
			<button type="button" onClick={() => setAddShelfGroupPopupVisible(false)}>
				Cancel
			</button>
		</form>
	);
};

export default AddShelfGroupPopup;
