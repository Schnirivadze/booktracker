import React from "react";

const BookShowPopup = ({ selectedBook, selectedShelf, closeBookShowPopup }) => {
  return (
    <div className="book-show-popup">
      <div className="info-wrapper">
        <div className="title">{selectedBook.title}</div>
        <div className="author">{selectedBook.author}</div>
        <div className="description">{selectedBook.description}</div>
      </div>

      {/* Table to represent the shelf */}
      <div className="table-container">
        <table>
          <tbody>
            {Array.from({ length: selectedShelf.y }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: selectedShelf.x }).map((_, colIndex) => (
                  <td
                    key={colIndex}
                    className={
                      rowIndex === selectedBook.y - 1 && colIndex === selectedBook.x - 1
                        ? "selected-shelf-rectangle"
                        : ""
                    }
                  ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Close button */}
      <div className="close" onClick={closeBookShowPopup}>
        ✖
      </div>
    </div>
  );
};

export default BookShowPopup;
