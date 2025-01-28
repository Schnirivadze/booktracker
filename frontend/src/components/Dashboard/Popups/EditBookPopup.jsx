import React from "react";

const EditBookPopup = ({
	newBookData,
	setNewBookData,
	handleEditBookSubmit,
	setEditBookPopupVisible,
}) => (
	<form className="add-book-popup" onSubmit={handleEditBookSubmit}>
		<label>
			Title:
			<input
				type="text"
				name="title"
				value={newBookData.title}
				onChange={(e) => setNewBookData({ ...newBookData, title: e.target.value })}
				required
			/>
		</label>
		<label>
			Author:
			<input
				type="text"
				name="author"
				value={newBookData.author}
				onChange={(e) => setNewBookData({ ...newBookData, author: e.target.value })}
				required
			/>
		</label>
		<label>
			Tags:
			<input
				type="text"
				name="tags"
				value={newBookData.tags}
				onChange={(e) => setNewBookData({ ...newBookData, tags: e.target.value })}
			/>
		</label>
		<label>
			Position X:
			<input
				type="number"
				name="x"
				value={newBookData.x}
				onChange={(e) => setNewBookData({ ...newBookData, x: e.target.value })}
				required
			/>
		</label>
		<label>
			Position Y:
			<input
				type="number"
				name="y"
				value={newBookData.y}
				onChange={(e) => setNewBookData({ ...newBookData, y: e.target.value })}
				required
			/>
		</label>
		<button type="submit">Save Changes</button>
		<button type="button" onClick={() => setEditBookPopupVisible(false)}>Cancel</button>
	</form>
);

export default EditBookPopup;
