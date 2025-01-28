import React from "react";

const AddShelfPopup = ({
  newShelfData,
  setNewShelfData,
  handleAddShelfSubmit,
  setAddShelfPopupVisible,
}) => (
  <form className="add-shelf-popup" onSubmit={handleAddShelfSubmit}>
    <label>
      Shelf Name:
      <input
        type="text"
        name="name"
        onChange={(e) => setNewShelfData({ ...newShelfData, name: e.target.value })}
        required
      />
    </label>
    <label>
      Columns:
      <input
        type="number"
        name="x"
        onChange={(e) => setNewShelfData({ ...newShelfData, x: e.target.value })}
        required
      />
    </label>
    <label>
      Rows:
      <input
        type="number"
        name="y"
        onChange={(e) => setNewShelfData({ ...newShelfData, y: e.target.value })}
        required
      />
    </label>
    <button type="submit">Add Shelf</button>
    <button type="button" onClick={() => setAddShelfPopupVisible(false)}>Cancel</button>
  </form>
);

export default AddShelfPopup;
