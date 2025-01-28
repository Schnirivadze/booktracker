import React from "react";

const SidePanel = ({
	shelfGroups,
	shelvesByGroup,
	setSelectedShelfId,
	setSelectedShelf,
	setAddShelfPopupVisible,
	setAddShelfGroupPopupVisible,
	setNewShelfData,
}) => {
	return (
		<div className="side-panel">
			{shelfGroups.map((group) => (
				<div key={group.id} className="shelf-group-wrapper">
					<div className="shelf-group-tile">{group.name}</div>
					<div className="self-group-shelves">
						{(shelvesByGroup[group.id] || []).map((shelf) => (
							<div
								key={shelf.id}
								className="shelf-option"
								onClick={() => {
									setSelectedShelfId(shelf.id);
									setSelectedShelf(shelf);
								}}
							>
								{shelf.name}
							</div>
						))}
						<div
							className="add-shelf-option"
							onClick={() => {
								setNewShelfData((prev) => ({ ...prev, shelfGroupId: group.id }));
								setAddShelfPopupVisible(true);
							}}
						>
							➕ Add Shelf
						</div>
					</div>
				</div>
			))}
			<div
				className="shelf-group-tile-add"
				onClick={() => setAddShelfGroupPopupVisible(true)}
			>
				➕ Add Shelf Group
			</div>
		</div>
	);
};

export default SidePanel;
