import '../client/public/App.css'
import Login from '../client/login.jsx'
import Register from '../client/register.jsx'
import {BrowserRouter,Routes,Route} from "react-router-dom";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
			</Routes>
		</BrowserRouter>
		
	)
}

export default App
