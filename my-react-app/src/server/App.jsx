import '../client/public/App.css'
import Login from '../client/login.jsx'
import Register from '../client/register.jsx'
import {BrowserRouter,Routes,Route, Link} from "react-router-dom";
import Navbar from '../client/navbar.jsx';
import Dashboard from '../client/dashboard.jsx';
import NewNote from '../client/newNote.jsx';
import React from 'react';
import Footer from '../client/footer.jsx';
import NewNote from '../client/newNote.jsx';
function App() {
	return (
		<BrowserRouter>
		<Navbar />
			<Routes>
				<Route path="/" element={<Login />} /> 
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/register" element={<Register />} />
<<<<<<< HEAD
				<Route path="/newNote" element={<NewNote />} /> /* Page to create a new note */
=======
				<Route path="/new-note" element={<NewNote />} />
>>>>>>> 000a100f5e390cd68fe213bb8fbe7bb306753ad8
			</Routes>
		<Footer />
		</BrowserRouter>
	)
}

export default App
