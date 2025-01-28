import React from "react";

const RightClickMenu = ({
  isVisible,
  position,
  onOpen,
  onEdit,
  onDelete,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className="right-click-menu"
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
      }}
    >
      <div className="option" onClick={onOpen}>Open</div>
      <div className="option" onClick={onEdit}>Edit</div>
      <div className="option" onClick={onDelete}>Delete</div>
    </div>
  );
};

export default RightClickMenu;
