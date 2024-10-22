import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { UserContext } from '../context/UserContext';

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
			<header className="is-flex is-justify-content-center is-align-items-center is-fullwidth p-3"> {/* has-background-black has-text-white */}
				<img src="/logo.png" alt="logo" />
			</header>
			{token && currentPath !== '/' && <Navbar />}
		</>
	);
};

export default Header;
