import React from "react";

const RightClickMenu = ({
	position,
	onOpen,
	onEdit,
	onDelete,
	rightClickedBook,
	selectedShelf,
	newShelfGroupData
}) => {
	return (
		<div className="right-click-menu" style={{ top: position.y, left: position.x }}>
			{rightClickedBook && (
				<>
					<div className="option" onClick={onOpen}>View Book</div>
					<div className="option" onClick={onEdit}>Edit Book</div>
					<div className="option" onClick={onDelete}>Delete Book</div>
				</>
			)}
			{selectedShelf && (
				<>
					<div className="option" onClick={onEdit}>Edit Shelf</div>
					<div className="option" onClick={onDelete}>Delete Shelf</div>
				</>
			)}
			{newShelfGroupData && (
				<>
					<div className="option" onClick={onEdit}>Edit Shelf Group</div>
					<div className="option" onClick={onDelete}>Delete Shelf Group</div>
				</>
			)}
		</div>
	);
};
export default RightClickMenu;