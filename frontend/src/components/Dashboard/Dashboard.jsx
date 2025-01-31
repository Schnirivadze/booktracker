import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

import TopBar from "./TopBar";
import SidePanel from "./SidePanel";
import MainContent from "./MainContent";
import AddBookPopup from "./Popups/AddBookPopup";
import EditBookPopup from "./Popups/EditBookPopup";
import EditShelfPopup from "./Popups/EditShelfPopup";
import AddShelfPopup from "./Popups/AddShelfPopup";
import AddShelfGroupPopup from "./Popups/AddShelfGroupPopup";
import EditShelfGroupPopup from "./Popups/EditShelfGroupPopup";
import BookShowPopup from "./Popups/BookShowPopup";
import RightClickMenu from "./RightClickMenu";

import useDashboardState from "../../hooks/useDashboardState";
import { useBookHandlers } from "../../hooks/useBookHandlers";
import { useShelfHandlers } from "../../hooks/useShelfHandlers";
import { useShelfGroupHandlers } from "../../hooks/useShelfGroupHandlers";

import '../../styles/Dashboard.css';

const Dashboard = () => {
	const { token, user, handleLogout } = useContext(AuthContext);
	const [shelfGroups, setShelfGroups] = useState([]);
	const [shelvesByGroup, setShelvesByGroup] = useState({});
	const [books, setBooks] = useState([]);
	const controllerRef = React.useRef(null);
	const {
		isEditBookPopupVisible,
		setEditBookPopupVisible,
		isEditShelfPopupVisible,
		setEditShelfPopupVisible,
		isAddBookPopupVisible,
		setAddBookPopupVisible,
		isAddShelfPopupVisible,
		setAddShelfPopupVisible,
		isAddShelfGroupPopupVisible,
		setAddShelfGroupPopupVisible,
		isEditShelfGroupPopupVisible,
		setEditShelfGroupPopupVisible,
		isBookShowPopupVisible,
		setBookShowPopupVisible,
		isRightClickMenuVisible,
		setRightClickMenuVisible,
		bookToEdit,
		setBookToEdit,
		selectedShelfId,
		setSelectedShelfId,
		selectedShelf,
		setSelectedShelf,
		selectedBook,
		setSelectedBook,
		rightClickMenuPosition,
		setRightClickMenuPosition,
		rightClickedBook,
		setRightClickedBook,
		newBookData,
		setNewBookData,
		newShelfData,
		setNewShelfData,
		newShelfGroupData,
		setNewShelfGroupData,
		searchQuery,
		setSearchQuery,
		searchResults,
		setSearchResults,
	} = useDashboardState();
	const { handleAddBookSubmit, handleEditBookSubmit, handleDeleteBook } = useBookHandlers({
		books,
		setBooks,
		setAddBookPopupVisible,
		setEditBookPopupVisible,
		setBookToEdit,
		newBookData,
		selectedShelfId,
		bookToEdit,
		token,
	});
	const { handleAddShelfSubmit, handleEditShelfSubmit , handleDeleteShelf} = useShelfHandlers({
		token,
		newShelfData,
		setShelvesByGroup,
		setAddShelfPopupVisible,
		setEditShelfPopupVisible
	});
	const {handleAddShelfGroupSubmit, handleEditShelfGroupSubmit, handleDeleteShelfGroup} = useShelfGroupHandlers({
		token,
		newShelfGroupData,
		setShelfGroups,
		setAddShelfGroupPopupVisible,
		setEditShelfGroupPopupVisible
	});
	const handleRightClick = (event, item, type) => {
		event.preventDefault();
		setRightClickMenuPosition({ x: event.pageX, y: event.pageY });
		setRightClickMenuVisible(true);

		// Store the right-clicked item and its type
		setRightClickedBook(type === "book" ? item : null);
		setSelectedShelf(type === "shelf" ? item : null);
		setSelectedShelfId(type === "shelf" ? item.id : null);
		setNewShelfGroupData(type === "shelfGroup" ? item : null);
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


	// Open Edit Shelf Popup
	const openEditShelfPopup = (shelf) => {
		setNewShelfData(shelf);
		setEditShelfPopupVisible(true);
	};
	// Open Edit ShelfGroups Popup
	const openEditShelfGroupsPopup = (shelfGroup) => {
		setNewShelfGroupData(shelfGroup);
		setEditShelfGroupPopupVisible(true);
	};
	// Attach a global click listener to hide the context menu
	useEffect(() => {
		document.addEventListener("click", () => { setRightClickMenuVisible(false); });
		return () => {
			document.removeEventListener("click", () => { setRightClickMenuVisible(false); });
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
					handleRightClick={handleRightClick}
				/>

				{!isEditShelfGroupPopupVisible && !isEditShelfPopupVisible && !isEditBookPopupVisible && !isBookShowPopupVisible && !isAddBookPopupVisible && !isAddShelfPopupVisible && !isAddShelfGroupPopupVisible &&
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
				{isEditShelfPopupVisible && (
					<EditShelfPopup
						newShelfData={newShelfData}
						setNewShelfData={setNewShelfData}
						handleEditShelfSubmit={handleEditShelfSubmit}
						setEditShelfPopupVisible={setEditShelfPopupVisible}
					/>
				)}
				{isEditShelfGroupPopupVisible && (
					<EditShelfGroupPopup
						newShelfGroupData={newShelfGroupData}
						setNewShelfGroupData={setNewShelfGroupData}
						handleEditShelfGroupSubmit={handleEditShelfGroupSubmit}
						setEditShelfGroupPopupVisible={setEditShelfGroupPopupVisible}
					/>
				)}
			</div>
			{isRightClickMenuVisible && (
				<RightClickMenu
					position={rightClickMenuPosition}
					rightClickedBook={rightClickedBook}
					selectedShelf={selectedShelf}
					newShelfGroupData={newShelfGroupData}
					onOpen={() => rightClickedBook && openBookShowPopup(rightClickedBook)}
					onEdit={() => {
						if (rightClickedBook) openEditBookPopup(rightClickedBook);
						else if (selectedShelf) openEditShelfPopup(selectedShelf);
						else if (newShelfGroupData) openEditShelfGroupsPopup(newShelfGroupData);
					}}
					onDelete={() => {
						if (rightClickedBook) handleDeleteBook(rightClickedBook.id);
						else if (selectedShelf) handleDeleteShelf(selectedShelf.id);
						else if (newShelfGroupData) handleDeleteShelfGroup(newShelfGroupData.id);
					}}
				/>
			)}
		</div >
	);
};

export default Dashboard;
