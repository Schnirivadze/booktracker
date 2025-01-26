import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const { token, user, handleLogout } = useContext(AuthContext);
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

  const controllerRef = React.useRef(null);

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
      {/* Top Bar */}
      <div className="top-bar">
        <input
          type="text"
          className="search-bar"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="settings-button">⚙️</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((result) => (
              <div key={result.id} className="search-result" onClick={() => openBookShowPopup(result)}>
                <b>{result.title}</b> by {result.author}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Wrapper */}
      <div className="bottom-wrapper">
        {/* Side Panel */}
        <div className="side-panel">
          {shelfGroups.map((group) => (
            <div key={group.id} className="shelf-group-wrapper">
              <div className="shelf-group-tile">{group.name}</div>
              <div className="self-group-shelves">
                {(shelvesByGroup[group.id] || []).map((shelf) => (
                  <div
                    key={shelf.id}
                    className="shelf-option"
                    onClick={() => { setSelectedShelfId(shelf.id); setAddShelfPopupVisible(false); setSelectedShelf(shelf) }}
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

        {/* Main Content */}
        {!isBookShowPopupVisible && !isAddBookPopupVisible && !isAddShelfPopupVisible && !isAddShelfGroupPopupVisible && (
          <div className="main-content">
            <div className="books-grid">
              {books.map((book) => (
                <div key={book.id} className="book-tile" onClick={() => openBookShowPopup(book)}>
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                  <div>
                    {book.tags.map((tag, index) => (
                      <span key={index} className="book-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
              <div className="book-tile-add" onClick={() => setAddBookPopupVisible(true)}>
                ➕ Add Book
              </div>
            </div>
          </div>
        )}

        {/* Book Show Popup */}
        {isBookShowPopupVisible && selectedBook && (
          <div className="book-show-popup">
            <div className="info-wrapper">
              <div className="title">{selectedBook.title}</div>
              <div className="author">{selectedBook.author}</div>
              <div className="description">{selectedBook.description}</div>
            </div>

            {/* Table to represent shelf */}
            <div className="table-container">
              <table>
                <tbody>
                  {/* Dynamically generate rows */}
                  {Array.from({ length: selectedShelf.y }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {/* Dynamically generate columns */}
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
            <div className="close" onClick={closeBookShowPopup}>✖</div>
          </div>
        )}

        {/* Add Book Popup */}
        {isAddBookPopupVisible && (
          <form className="add-book-popup" onSubmit={handleAddBookSubmit}>
            <label>
              Title:
              <input
                type="text"
                name="title"
                onChange={(e) =>
                  setNewBookData({ ...newBookData, title: e.target.value })
                }
                required
              />
            </label>
            <label>
              Author:
              <input
                type="text"
                name="author"
                onChange={(e) =>
                  setNewBookData({ ...newBookData, author: e.target.value })
                }
                required
              />
            </label>
            <label>
              Tags:
              <input
                type="text"
                name="tags"
                onChange={(e) =>
                  setNewBookData({ ...newBookData, tags: e.target.value })
                }
              />
            </label>
            <label>
              Position X:
              <input
                type="number"
                name="x"
                onChange={(e) =>
                  setNewBookData({ ...newBookData, x: e.target.value })
                }
                required
              />
            </label>
            <label>
              Position Y:
              <input
                type="number"
                name="y"
                onChange={(e) =>
                  setNewBookData({ ...newBookData, y: e.target.value })
                }
                required
              />
            </label>
            <button type="submit">Add Book</button>
            <button
              type="button"
              onClick={() => setAddBookPopupVisible(false)}
            >
              Cancel
            </button>
          </form>
        )}

        {/* Add Shelf Popup */}
        {isAddShelfPopupVisible && (
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
              Columns
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
        )}

        {/* Add Shelf Group Popup */}
        {isAddShelfGroupPopupVisible && (
          <form className="add-shelf-group-popup" onSubmit={handleAddShelfGroupSubmit}>
            <label>
              Shelf Group Name:
              <input
                type="text"
                name="name"
                onChange={(e) => setNewShelfGroupData({ ...newShelfGroupData, name: e.target.value })}
                required
              />
            </label>
            <button type="submit">Add Shelf Group</button>
            <button type="button" onClick={() => setAddShelfGroupPopupVisible(false)}>Cancel</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
