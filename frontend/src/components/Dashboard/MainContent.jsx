// MainContent.js
import React from "react";

const MainContent = ({
	books,
	openBookShowPopup,
	handleRightClick,
	setAddBookPopupVisible,
}) => {
	return (
		<div className="main-content">
			<div className="books-grid">
				{books.map((book) => (
					<div
						key={book.id}
						className="book-tile"
						onClick={() => openBookShowPopup(book)}
						onContextMenu={(event) => handleRightClick(event, book)}
					>
						<h3>{book.title}</h3>
						<p>{book.author}</p>
						<div>
							{book.tags.map((tag, index) => (
								<span key={index} className="book-tag">
									{tag}
								</span>
							))}
						</div>
					</div>
				))}
				<div
					className="book-tile-add"
					onClick={() => setAddBookPopupVisible(true)}
				>
					➕ Add Book
				</div>
			</div>
		</div>
	);
};

export default MainContent;
