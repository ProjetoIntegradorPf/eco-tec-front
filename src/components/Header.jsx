import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { UserContext } from '../context/UserContext';
import logo from './logo.svg';

const Header = () => {
	const currentPath = window.location.pathname;
	const [token] = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (!token && currentPath === '/home') {
			navigate('/');
		}
	}, [token, currentPath, navigate]);

	return (
		<>
			<header className="is-flex is-justify-content-center is-align-items-center is-fullwidth has-background-primary py-4">
				<img 
					src={logo} 
					alt="logo" 
					className="header-logo"
					style={{ height: '100px', width: 'auto' }} // Ajusta a altura para 100px e a largura será proporcional
				/>
				<h1 className="has-text-weight-bold is-size-1 ml-3">ECO TEC</h1>
			</header>
			{token && currentPath !== '/' && <Navbar />}
		</>
	);
};

export default Header;
