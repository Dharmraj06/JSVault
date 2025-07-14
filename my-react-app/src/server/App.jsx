import '../client/public/App.css'
import Login from '../client/login.jsx'
import Register from '../client/register.jsx'
import {BrowserRouter,Routes,Route, Link} from "react-router-dom";
import Navbar from '../client/navbar.jsx';
function App() {
	return (
		<BrowserRouter>
		<Navbar />
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/register" element={<Register />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
