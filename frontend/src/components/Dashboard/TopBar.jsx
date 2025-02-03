import React, { useState } from "react";
import "../../styles/Dashboard.css";

const TopBar = ({ searchQuery, setSearchQuery, searchResults, openBookShowPopup, handleLogout, setSettingsPopupVisible }) => {
	const [isSearchFocused, setIsSearchFocused] = useState(false);

	return (
		<div className="top-bar">
			<input
				type="text"
				className="search-bar"
				placeholder="Search books..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				onFocus={() => setIsSearchFocused(true)}
				onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
			/>
			<button
				className="settings-button"
				onClick={() => setSettingsPopupVisible(true)}>⚙️</button>
			<button className="logout-button" onClick={handleLogout}>
				Logout
			</button>
			{isSearchFocused && searchResults.length > 0 && (
				<div className="search-results">
					{searchResults.map((result) => (
						<div
							key={result.id}
							className="search-result"
							onClick={() => openBookShowPopup(result)}
						>
							<b>{result.title}</b> by {result.author}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default TopBar;
