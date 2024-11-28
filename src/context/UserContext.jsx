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
					  Authorization: `Bearer ${token}`
					}
				  });
				if (!response.ok) {
					setToken(null);
				}
			} catch (error) {
				console.error('Error fetching user:', error);
				setToken(null);
			}

			localStorage.setItem('awesomeTransactionsToken', token || '');
		};
		fetchUser();
	}, [token]);

	return <UserContext.Provider value={[token, setToken]}>{props.children}</UserContext.Provider>;
};
