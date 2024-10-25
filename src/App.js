import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import Login from './components/Login';
import BasePage from './components/BasePage';
import './App.css'; // Caso você tenha estilos adicionais
import CardMenu from './components/CardMenu';

const App = ({Component=CardMenu}) => {
	const [token] = useContext(UserContext); // Estado de autenticação
	const navigate = useNavigate();

	useEffect(() => {
		// Redireciona para /home se o usuário está autenticado e na página inicial
		if (token && window.location.pathname === '/') {
			navigate('/home');
		}
		// Redireciona para login se o usuário não está autenticado
		if (!token && window.location.pathname !== '/') {
			navigate('/');
		}
	}, [token, navigate]);

	return (
		<>
			{token ? (
        		<BasePage showLogin={false} Component={Component} /> 
			) : (
				<div>
					<BasePage showLogin /> {/* Quando não autenticado, renderiza o login dentro da BasePage */}
				</div>
			)}
		</>
	);
};

export default App;
