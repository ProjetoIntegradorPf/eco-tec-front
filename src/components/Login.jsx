import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ErrorMessage from './ErrorMessage';
import { UserContext } from '../context/UserContext';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [, setToken] = useContext(UserContext);
	const navigate = useNavigate();

	const submitLogin = async () => {
		try {
			// Fazendo a requisição POST com Axios
			const response = await api.post('/token', {
				username: email,
				password: password,
				grant_type: '', // Outros parâmetros que seu backend espera
				scope: '',
				client_id: '',
				client_secret: ''
			});

			// Se a resposta for bem-sucedida
			const { access_token } = response.data;
			setToken(access_token); // Salvando o token no contexto
			navigate('/home'); // Redirecionando o usuário para a home
		} catch (error) {
			// Tratamento de erros
			if (error.response) {
				// Resposta de erro vinda do servidor (ex.: 400, 401, etc.)
				if (error.response.status >= 400 && error.response.status < 500) {
					setErrorMessage('E-mail ou senha inválidos');
				} else {
					setErrorMessage(error.response.data.detail || 'Erro no servidor');
				}
			} else {
				// Erro de conexão ou outro problema
				setErrorMessage('Erro ao conectar com o servidor');
			}
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		submitLogin();
	};

	return (
		<div className="column">
			<form className="box" onSubmit={handleSubmit}>
				<h1 className="title has-text-centered">Login</h1>
				<div className="field">
					<label className="label">E-mail</label>
					<div className="control">
						<input
							type="email"
							placeholder="Digite seu e-mail aqui..."
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="input"
							required
						/>
					</div>
				</div>
				<div className="field">
					<label className="label">Senha</label>
					<div className="control">
						<input
							type="password"
							placeholder="Digite a sua senha aqui..."
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="input"
							required
						/>
					</div>
				</div>
				<ErrorMessage message={errorMessage} />
				<br />
				<button className="button is-primary centered" type="submit">
					Login
				</button>
			</form>
		</div>
	);
};

export default Login;
