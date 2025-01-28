import { useState } from "react";

const useDashboardState = () => {
  // UI State for popups visibility
  const [isEditBookPopupVisible, setEditBookPopupVisible] = useState(false);
  const [isAddBookPopupVisible, setAddBookPopupVisible] = useState(false);
  const [isAddShelfPopupVisible, setAddShelfPopupVisible] = useState(false);
  const [isAddShelfGroupPopupVisible, setAddShelfGroupPopupVisible] = useState(false);
  const [isBookShowPopupVisible, setBookShowPopupVisible] = useState(false);
  const [isRightClickMenuVisible, setRightClickMenuVisible] = useState(false);

  // UI State for selected items and data
  const [bookToEdit, setBookToEdit] = useState(null);
  const [selectedShelfId, setSelectedShelfId] = useState(null);
  const [selectedShelf, setSelectedShelf] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  // UI State for right-click menu
  const [rightClickMenuPosition, setRightClickMenuPosition] = useState({ x: 0, y: 0 });
  const [rightClickedBook, setRightClickedBook] = useState(null);

  // UI State for form data
  const [newBookData, setNewBookData] = useState({
    x: "",
    y: "",
    title: "",
    author: "",
    tags: "",
  });
  const [newShelfData, setNewShelfData] = useState({ name: "", x: null, y: null, shelfGroupId: null });
  const [newShelfGroupData, setNewShelfGroupData] = useState({ name: "" });

  // State for search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  return {
    // Popup visibility
    isEditBookPopupVisible,
    setEditBookPopupVisible,
    isAddBookPopupVisible,
    setAddBookPopupVisible,
    isAddShelfPopupVisible,
    setAddShelfPopupVisible,
    isAddShelfGroupPopupVisible,
    setAddShelfGroupPopupVisible,
    isBookShowPopupVisible,
    setBookShowPopupVisible,
    isRightClickMenuVisible,
    setRightClickMenuVisible,

    // Selected items and data
    bookToEdit,
    setBookToEdit,
    selectedShelfId,
    setSelectedShelfId,
    selectedShelf,
    setSelectedShelf,
    selectedBook,
    setSelectedBook,

    // Right-click menu
    rightClickMenuPosition,
    setRightClickMenuPosition,
    rightClickedBook,
    setRightClickedBook,

    // Form data
    newBookData,
    setNewBookData,
    newShelfData,
    setNewShelfData,
    newShelfGroupData,
    setNewShelfGroupData,

    // Search state
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
  };
};

export default useDashboardState;
