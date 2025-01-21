import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import '../../styles/Dashboard.css'; 

const Dashboard = () => {
  const { token, user, handleLogout } = useContext(AuthContext);
  const [shelfGroups, setShelfGroups] = useState([]);
  const [selectedShelfId, setSelectedShelfId] = useState(null);
  const [books, setBooks] = useState([]);

  // Fetch shelf groups on load
  useEffect(() => {
    if (user) {
      console.log("Fetching shelf groups...");
      Promise.all(
        user.shelfGroupIds.map((id) =>
          fetch(`http://localhost:8080/api/shelf-groups/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => res.json())
        )
      )
        .then((groups) => {
          console.log("Shelf groups fetched:", groups);
          setShelfGroups(groups);
        })
        .catch((error) => console.error("Error fetching shelf groups:", error));
    }
  }, [user, token]);

  // Fetch books when a shelf is selected
  useEffect(() => {
    if (selectedShelfId) {
      console.log(`Fetching books for shelf ${selectedShelfId}...`);
      fetch(`http://localhost:8080/api/books/shelf/${selectedShelfId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Books fetched:", data);
          setBooks(data);
        })
        .catch((error) => console.error("Error fetching books:", error));
    }
  }, [selectedShelfId, token]);

  return (
    <div>
      {/* Top Bar */}
      <div className="top-bar">
        <input
          type="text"
          className="search-bar"
          placeholder="Search books..."
          onChange={(e) => console.log("Searching:", e.target.value)}
        />
        <button className="settings-button">⚙️</button>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Bottom Wrapper */}
      <div className="bottom-wrapper">
        {/* Side Panel */}
        <div className="side-panel">
          {shelfGroups.map((group) => (
            <div key={group.id}>
              <div className="shelf-group-tile">{group.name}</div>
              <div className="self-group-shelves">
                {group.shelves.map((shelf) => (
                  <div
                    key={shelf.id}
                    className="shelf-option"
                    onClick={() => setSelectedShelfId(shelf.id)}
                  >
                    {shelf.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="shelf-group-tile-add">➕</div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="books-grid">
            {books.map((book) => (
              <div key={book.id} className="book-tile">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <div>
                  {book.tags.map((tag, index) => (
                    <tag key={index}>{tag}</tag>
                  ))}
                </div>
              </div>
            ))}
            <div className="book-tile-add">➕</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
