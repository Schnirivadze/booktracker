import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import TopBar from "./TopBar";
import SidePanel from "./SidePanel";
import MainContent from "./MainContent";
import AddBookPopup from "./Popups/AddBookPopup";
import EditBookPopup from "./Popups/EditBookPopup";
import AddShelfPopup from "./Popups/AddShelfPopup";
import AddShelfGroupPopup from "./Popups/AddShelfGroupPopup";
import BookShowPopup from "./Popups/BookShowPopup";
import RightClickMenu from "./RightClickMenu";
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const { token, user, handleLogout } = useContext(AuthContext);
  const [isEditBookPopupVisible, setEditBookPopupVisible] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [shelfGroups, setShelfGroups] = useState([]);
  const [shelvesByGroup, setShelvesByGroup] = useState({});
  const [selectedShelfId, setSelectedShelfId] = useState(null);
  const [selectedShelf, setSelectedShelf] = useState(null);
  const [books, setBooks] = useState([]);
  const [isAddBookPopupVisible, setAddBookPopupVisible] = useState(false);
  const [isAddShelfPopupVisible, setAddShelfPopupVisible] = useState(false);
  const [isAddShelfGroupPopupVisible, setAddShelfGroupPopupVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [newBookData, setNewBookData] = useState({
    x: "",
    y: "",
    title: "",
    author: "",
    tags: "",
  });
  const [newShelfData, setNewShelfData] = useState({ name: "", x: null, y: null, shelfGroupId: null });
  const [newShelfGroupData, setNewShelfGroupData] = useState({ name: "" });

  // State to handle book show popup
  const [isBookShowPopupVisible, setBookShowPopupVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // State for right-click menu
  const [isRightClickMenuVisible, setRightClickMenuVisible] = useState(false);
  const [rightClickMenuPosition, setRightClickMenuPosition] = useState({ x: 0, y: 0 });
  const [rightClickedBook, setRightClickedBook] = useState(null);

  const controllerRef = React.useRef(null);
  const handleRightClick = (event, book) => {
    event.preventDefault(); // Prevent the default browser context menu
    setRightClickMenuPosition({ x: event.pageX, y: event.pageY });
    setRightClickMenuVisible(true);
    setRightClickedBook(book);
  };
  const handleGlobalClick = () => {
    setRightClickMenuVisible(false); // Hide the context menu on global click
  };

  // Attach a global click listener to hide the context menu
  useEffect(() => {
    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);
  // Fetch shelf groups on load
  useEffect(() => {
    if (!user) return;

    const abortController = new AbortController();
    controllerRef.current = abortController;

    Promise.all(
      user.shelfGroupIds.map((id) =>
        fetch(`http://localhost:8080/api/shelf-groups/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortController.signal,
        }).then((res) => res.json())
      )
    )
      .then((groups) => setShelfGroups(groups))
      .catch((error) => console.error("Error fetching shelf groups:", error));

    return () => abortController.abort();
  }, [user, token]);

  // Fetch shelves for each group
  useEffect(() => {
    if (shelfGroups.length === 0) return;

    const fetchShelvesForGroups = async () => {
      const newShelves = {};
      await Promise.all(
        shelfGroups.map(async (group) => {
          if (!shelvesByGroup[group.id]) {
            try {
              const shelves = await Promise.all(
                group.shelfIds.map((shelfId) =>
                  fetch(`http://localhost:8080/api/shelves/${shelfId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  }).then((res) => res.json())
                )
              );
              newShelves[group.id] = shelves;
            } catch (error) {
              console.error(`Error fetching shelves for group ${group.id}:`, error);
            }
          }
        })
      );
      setShelvesByGroup((prev) => ({ ...prev, ...newShelves }));
    };

    fetchShelvesForGroups();
  }, [shelfGroups, token]);

  // Fetch books when a shelf is selected
  useEffect(() => {
    if (!selectedShelfId) return;

    const abortController = new AbortController();
    controllerRef.current = abortController;

    fetch(`http://localhost:8080/api/books/shelf/${selectedShelfId}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: abortController.signal,
    })
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error fetching books:", error));

    return () => abortController.abort();
  }, [selectedShelfId, token]);

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
  // Add this function to handle the deletion of a book
  const handleDeleteBook = async (bookId) => {
    const confirmation = window.confirm("Are you sure you want to delete this book?");
    if (!confirmation) return;

    try {
      const response = await fetch(`http://localhost:8080/api/books/${bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the book");
      }

      // Remove the deleted book from the state
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
      setRightClickMenuVisible(false); // Hide the context menu
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete the book. Please try again.");
    }
  };
  // Open Edit Book Popup
  const openEditBookPopup = (book) => {
    setBookToEdit(book);
    setNewBookData({
      title: book.title,
      author: book.author,
      tags: book.tags.join(", "),
      x: book.x,
      y: book.y,
    });
    setEditBookPopupVisible(true);
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
          prevBooks.map((book) =>
            book.id === updatedBook.id ? updatedBook : book
          )
        );
        setEditBookPopupVisible(false);
        setBookToEdit(null);
      })
      .catch((error) => console.error("Error updating book:", error));
  };
  // Handle Add Shelf
  const handleAddShelfSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/api/shelves", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newShelfData),
    })
      .then((res) => res.json())
      .then((shelf) => {
        setShelvesByGroup((prevShelves) => ({
          ...prevShelves,
          [shelf.shelfGroupId]: [...(prevShelves[shelf.shelfGroupId] || []), shelf],
        }));
        setAddShelfPopupVisible(false);
      })
      .catch((error) => console.error("Error adding shelf:", error));
  };
  // Handle Add Shelf Group
  const handleAddShelfGroupSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/api/shelf-groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newShelfGroupData),
    })
      .then((res) => res.json())
      .then((group) => {
        setShelfGroups((prevGroups) => [...prevGroups, group]);
        setAddShelfGroupPopupVisible(false);
      })
      .catch((error) => console.error("Error adding shelf group:", error));
  };
  // Handle search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetch(`http://localhost:8080/api/books/search?keyword=${encodeURIComponent(searchQuery)}&shelfId=${encodeURIComponent(selectedShelfId)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

        .then((res) => res.json())
        .then((results) => setSearchResults(results))
        .catch((error) => console.error("Error fetching search results:", error));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, token]);

  // Open Book Show Popup
  const openBookShowPopup = (book) => {
    setSelectedBook(book);
    setBookShowPopupVisible(true);
  };

  // Close Book Show Popup
  const closeBookShowPopup = () => {
    setBookShowPopupVisible(false);
    setSelectedBook(null);
  };

  return (
    <div>
      <TopBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        openBookShowPopup={openBookShowPopup}
        handleLogout={handleLogout}
      />

      <div className="bottom-wrapper">
        <SidePanel
          shelfGroups={shelfGroups}
          shelvesByGroup={shelvesByGroup}
          setSelectedShelfId={setSelectedShelfId}
          setSelectedShelf={setSelectedShelf}
          setAddShelfPopupVisible={setAddShelfPopupVisible}
          setAddShelfGroupPopupVisible={setAddShelfGroupPopupVisible}
          setNewShelfData={setNewShelfData}
        />

        {!isEditBookPopupVisible && !isBookShowPopupVisible && !isAddBookPopupVisible && !isAddShelfPopupVisible && !isAddShelfGroupPopupVisible &&
          <MainContent
            books={books}
            openBookShowPopup={openBookShowPopup}
            handleRightClick={handleRightClick}
            setAddBookPopupVisible={setAddBookPopupVisible}
          />}


        {/* Popups */}
        {isAddBookPopupVisible && (
          <AddBookPopup
            newBookData={newBookData}
            setNewBookData={setNewBookData}
            handleAddBookSubmit={handleAddBookSubmit}
            setAddBookPopupVisible={setAddBookPopupVisible}
          />
        )}
        {isBookShowPopupVisible && selectedBook && (
          <BookShowPopup
            selectedBook={selectedBook}
            selectedShelf={selectedShelf}
            closeBookShowPopup={closeBookShowPopup}
          />
        )}
        {isAddShelfGroupPopupVisible && (
          <AddShelfGroupPopup
            newShelfGroupData={newShelfGroupData}
            setNewShelfGroupData={setNewShelfGroupData}
            handleAddShelfGroupSubmit={handleAddShelfGroupSubmit}
            setAddShelfGroupPopupVisible={setAddShelfGroupPopupVisible}
          />
        )}
        {isEditBookPopupVisible && (
          <EditBookPopup
            newBookData={newBookData}
            setNewBookData={setNewBookData}
            handleEditBookSubmit={handleEditBookSubmit}
            setEditBookPopupVisible={setEditBookPopupVisible}
          />
        )}
        {isAddShelfPopupVisible && (
          <AddShelfPopup
            newShelfData={newShelfData}
            setNewShelfData={setNewShelfData}
            handleAddShelfSubmit={handleAddShelfSubmit}
            setAddShelfPopupVisible={setAddShelfPopupVisible}
          />
        )}
      </div>
      <RightClickMenu
          isVisible={isRightClickMenuVisible}
          position={rightClickMenuPosition}
          onOpen={() => openBookShowPopup(rightClickedBook)}
          onEdit={() => openEditBookPopup(rightClickedBook)}
          onDelete={() => handleDeleteBook(rightClickedBook.id)}
        />
    </div >
  );
};

export default Dashboard;
