import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import '../client/public/login.css';
import '../client/public/dashboard.css';
import '../client/public/footer.css';
import '../client/public/newNote.css';

createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
