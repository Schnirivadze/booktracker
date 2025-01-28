import React from "react";

const AddBookPopup = ({
	newBookData,
	setNewBookData,
	handleAddBookSubmit,
	setAddBookPopupVisible,
}) => (
	<form className="add-book-popup" onSubmit={handleAddBookSubmit}>
		<label>
			Title:
			<input
				type="text"
				name="title"
				onChange={(e) => setNewBookData({ ...newBookData, title: e.target.value })}
				required
			/>
		</label>
		<label>
			Author:
			<input
				type="text"
				name="author"
				onChange={(e) => setNewBookData({ ...newBookData, author: e.target.value })}
				required
			/>
		</label>
		<label>
			Tags:
			<input
				type="text"
				name="tags"
				onChange={(e) => setNewBookData({ ...newBookData, tags: e.target.value })}
			/>
		</label>
		<label>
			Position X:
			<input
				type="number"
				name="x"
				onChange={(e) => setNewBookData({ ...newBookData, x: e.target.value })}
				required
			/>
		</label>
		<label>
			Position Y:
			<input
				type="number"
				name="y"
				onChange={(e) => setNewBookData({ ...newBookData, y: e.target.value })}
				required
			/>
		</label>
		<button type="submit">Add Book</button>
		<button type="button" onClick={() => setAddBookPopupVisible(false)}>Cancel</button>
	</form>
);

export default AddBookPopup;
