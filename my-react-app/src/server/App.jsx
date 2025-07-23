import '../client/public/App.css'
import Login from '../client/login.jsx'
import Register from '../client/register.jsx'
import {BrowserRouter,Routes,Route, Link} from "react-router-dom";
import Navbar from '../client/navbar.jsx';
import Dashboard from '../client/dashboard.jsx';
import Footer from '../client/footer.jsx';
import NewNote from '../client/newNote.jsx';
import EditNote from '../client/editNote.jsx';
import AllNotes from '../client/allnotes.jsx';
function App() {
	return (
		<BrowserRouter>
		<Navbar />
			<Routes>
				<Route path="/" element={<Login />} /> 
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/register" element={<Register />} />
				<Route path="/newNote" element={<NewNote />} />
				<Route path="/editNotes/:id" element={<EditNote />} />
				<Route path="/AllNotes" element={<AllNotes />} />
			</Routes>
		<Footer />
		</BrowserRouter>
	)
}

export default App
