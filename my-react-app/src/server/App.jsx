import '../client/public/App.css'
import Login from '../client/login.jsx'
import Register from '../client/register.jsx'
import {BrowserRouter,Routes,Route, Link} from "react-router-dom";
import Navbar from '../client/navbar.jsx';
import Dashboard from '../client/dashboard.jsx';
import React from 'react';
import Footer from '../client/footer.jsx';
function App() {
	return (
		<BrowserRouter>
		<Navbar />
			<Routes>
				<Route path="/" element={<Login />} /> /* Main login page */
				<Route path="/dashboard" element={<Dashboard />} /> /*
				<Route path="/register" element={<Register />} />
			</Routes>
		<Footer />
		</BrowserRouter>
	)
}

export default App
