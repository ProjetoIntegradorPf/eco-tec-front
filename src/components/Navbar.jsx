import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
	const [token, setToken] = useContext(UserContext);
	const location = useLocation();

	const cards = [
		{ name: 'Relatório Geral', component: 'relatorio-geral' },
		{ name: 'Relatório de Despesas', component: 'despesas' },
		{ name: 'Relatório de Receitas', component: 'receitas' },
		// { name: 'Relatório de Investimentos', component: 'investimentos' },
		{ name: 'Cadastrar Categoria de Receita', component: 'categoria-receita' },
		{ name: 'Cadastrar Categoria de Despesa', component: 'categoria-despesa' }
		// { name: 'Cadastrar Categoria de Investimento', component: 'categoria-investimento' }
	];

	const handleLogout = () => {
		setToken(null);
		localStorage.removeItem('awesomeTransactionsToken');
	};

	return (
		<nav className="navbar is-dark is-flex is-justify-content-center m-3">
			{location.pathname === '/home' ? (
				<Link to="/" className="navbar-item" onClick={handleLogout}>
					Sair
				</Link>
			) : (
				<>
					<Link to="/" className="navbar-item">
						Home
					</Link>
					{cards.map(({ name, component }) => (
						<Link to={`/${component}`} className="navbar-item" key={component}>
							{name}
						</Link>
					))}
					<Link to="/" className="navbar-item" onClick={handleLogout}>
						Sair
					</Link>
				</>
			)}
		</nav>
	);
};

export default Navbar;
