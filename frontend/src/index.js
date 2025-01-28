import React from 'react';
import './styles/App.css';

import ReactDOM from 'react-dom/client'; // Update import
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);