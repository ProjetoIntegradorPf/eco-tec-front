import React, { createContext, useEffect, useState } from 'react';

import api from '../api';

export const UserContext = createContext();

export const UserProvider = (props) => {
	const [token, setToken] = useState(localStorage.getItem('awesomeTransactionsToken') || '');

	useEffect(() => {
		const fetchUser = async () => {
			if (!token) return;

			const requestOptions = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			};

			try {
				const response = await api.get('/users/me', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
			} catch (error) {
				if (error.response) {
					// O servidor respondeu com um status fora da faixa 2xx
					console.error('HTTP error:', error.response.status);
					console.error('Error details:', error.response.data);
				} else if (error.request) {
					// A requisição foi feita, mas nenhuma resposta foi recebida
					console.error('No response received:', error.request);
				} else {
					// Outro erro ao configurar a requisição
					console.error('Error setting up request:', error.message);
				}
			
				setToken(null);
			}
			

			localStorage.setItem('awesomeTransactionsToken', token || '');
		};
		fetchUser();
	}, [token]);

	return <UserContext.Provider value={[token, setToken]}>{props.children}</UserContext.Provider>;
};
