import React from "react";

const EditShelfPopup = ({
	newShelfData,
	setNewShelfData,
	handleEditShelfSubmit,
	setEditShelfPopupVisible,
}) => (
	<form className="add-shelf-popup" onSubmit={handleEditShelfSubmit}>
		<label>
			Shelf Name:
			<input
				type="text"
				name="name"
				value={newShelfData.name}
				onChange={(e) => setNewShelfData({ ...newShelfData, name: e.target.value })}
				required
			/>
		</label>
		<label>
			Columns:
			<input
				type="number"
				name="x"
				value={newShelfData.x}
				onChange={(e) => setNewShelfData({ ...newShelfData, x: e.target.value })}
				required
			/>
		</label>
		<label>
			Rows:
			<input
				type="number"
				name="y"
				value={newShelfData.y}
				onChange={(e) => setNewShelfData({ ...newShelfData, y: e.target.value })}
				required
			/>
		</label>
		<button type="submit">Edit Shelf</button>
		<button type="button" onClick={() => setEditShelfPopupVisible(false)}>Cancel</button>
	</form>
);

export default EditShelfPopup;
