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
	const { handleAddShelfSubmit } = useShelfHandlers({
		token,
		newShelfData,
		setShelvesByGroup,
		setAddShelfPopupVisible
	});
	const { handleAddShelfGroupSubmit } = useShelfGroupHandlers({
		token,
		newShelfGroupData,
		setShelfGroups,
		setAddShelfGroupPopupVisible
	});
	const handleRightClick = (event, book) => {
		event.preventDefault();
		setRightClickMenuPosition({ x: event.pageX, y: event.pageY });
		setRightClickMenuVisible(true);
		setRightClickedBook(book);
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
			{isRightClickMenuVisible && (<RightClickMenu
				position={rightClickMenuPosition}
				onOpen={() => openBookShowPopup(rightClickedBook)}
				onEdit={() => openEditBookPopup(rightClickedBook)}
				onDelete={() => handleDeleteBook(rightClickedBook.id)}
			/>)}
		</div >
	);
};

export default Dashboard;
