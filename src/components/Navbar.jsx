import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faHomeLg } from '@fortawesome/free-solid-svg-icons';
import api from '../api';
import ErrorMessage from './ErrorMessage';

const Navbar = () => {
	const [token, setToken] = useContext(UserContext); // Estado do token
	const location = useLocation(); // Detecta a rota atual
	const [errorMessage, setErrorMessage] = useState(''); // Estado para mensagem de erro

	const submitLogout = async () => {
		try {
			await api.post('/logout', {}, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
		} catch (error) {
			setErrorMessage('Erro ao conectar com o servidor');
		}
	};

	// Função de logout
	const handleLogout = () => {
		submitLogout();
		setToken(null);
		localStorage.removeItem('awesomeTransactionsToken'); // Remove o token do localStorage
	};

	return (
		<nav className="has-background-link-bold is-flex is-justify-content-center mt-0 py-1">
			{location.pathname === '/home' && token ? (
				<Link to="/" className="navbar-item has-text-white" onClick={handleLogout}>
					<span className="icon">
						<FontAwesomeIcon icon={faSignOutAlt} size="2x" />
					</span>
					<span className="ml-2 is-size-4 has-text-weight-semi-bold">Sair</span>
				</Link>
			) : (
				<Link to="/home" className="navbar-item has-text-white">
					<span className="icon">
						<FontAwesomeIcon icon={faHomeLg} size="2x" />
					</span>
					<span className="ml-2 is-size-4 has-text-weight-semi-bold">Home</span>
					{/* Espaçamento maior entre os spans */}
					<span className="mr-5"></span>
					<span>|</span>
					<span className="mr-5"></span>
					<span className="icon" onClick={handleLogout}>
						<FontAwesomeIcon icon={faSignOutAlt} size="2x" />
					</span>
					<span className="ml-2 is-size-4 has-text-weight-semi-bold" onClick={handleLogout}>Sair</span>
				</Link>
			)}
			<ErrorMessage message={errorMessage} />
		</nav>
	);
};

export default Navbar;
