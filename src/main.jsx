import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from 'react-router-dom';

import './index.css'
import App from './App.jsx'
import NavBar from './Components/Navbar.jsx';
import "bootstrap/dist/js/bootstrap.bundle.js";
import Footer from './Components/Footer.jsx';


createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>
);
