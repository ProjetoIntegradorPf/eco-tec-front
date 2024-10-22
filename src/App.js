// src/App.js
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import Login from './components/Login';
import Header from './components/Header';
import BasePage from './components/BasePage';
import './App.css'; // Caso você tenha estilos adicionais

const App = () => {
	const [token] = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (token && window.location.pathname === '/') {
			navigate('/home');
		}
		if (!token && window.location.pathname.includes('/')) {
			navigate('/');
		}
	}, [token, navigate]);

	return (
		<>
			{!token ? (
				<div>
					<Header />
					<div className="columns is-centered is-vcentered is-flex is-justify-content-center mt-6">
						<div className="column is-one-third">
								<Login />
						</div>
					</div>
				</div>
			) : (
				<BasePage />
			)}
		</>
	);
};

export default App;
