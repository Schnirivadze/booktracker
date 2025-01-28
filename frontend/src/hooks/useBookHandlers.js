export const useBookHandlers = ({
  setBooks,
  setAddBookPopupVisible,
  setEditBookPopupVisible,
  setBookToEdit,
  newBookData,
  selectedShelfId,
  bookToEdit,
  token,
}) => {
  // Handle Add Book
  const handleAddBookSubmit = (e) => {
    e.preventDefault();

    const bookData = {
      ...newBookData,
      shelfId: selectedShelfId,
      tags: newBookData.tags.split(",").map((tag) => tag.trim()),
      x: parseInt(newBookData.x),
      y: parseInt(newBookData.y),
    };

    if (isNaN(bookData.x) || isNaN(bookData.y)) {
      alert("Position X and Y must be valid integers.");
      return;
    }

    fetch("http://localhost:8080/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    })
      .then((res) => res.json())
      .then((book) => {
        setBooks((prevBooks) => [...prevBooks, book]);
        setAddBookPopupVisible(false);
      })
      .catch((error) => console.error("Error adding book:", error));
  };

  // Handle Edit Book
  const handleEditBookSubmit = (e) => {
    e.preventDefault();

    const updatedBookData = {
      ...newBookData,
      shelfId: selectedShelfId,
      tags: newBookData.tags.split(",").map((tag) => tag.trim()),
      x: parseInt(newBookData.x),
      y: parseInt(newBookData.y),
    };

    if (isNaN(updatedBookData.x) || isNaN(updatedBookData.y)) {
      alert("Position X and Y must be valid integers.");
      return;
    }

    fetch(`http://localhost:8080/api/books/${bookToEdit.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedBookData),
    })
      .then((res) => res.json())
      .then((updatedBook) => {
        setBooks((prevBooks) =>
          prevBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
        );
        setEditBookPopupVisible(false);
        setBookToEdit(null);
      })
      .catch((error) => console.error("Error updating book:", error));
  };

  // Handle Delete Book
  const handleDeleteBook = (bookId) => {
    const confirmation = window.confirm("Are you sure you want to delete this book?");
    if (!confirmation) return;

    fetch(`http://localhost:8080/api/books/${bookId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
      })
      .catch((error) => {
        console.error("Error deleting book:", error);
        alert("Failed to delete the book. Please try again.");
      });
  };

  return { handleAddBookSubmit, handleEditBookSubmit, handleDeleteBook };
};
