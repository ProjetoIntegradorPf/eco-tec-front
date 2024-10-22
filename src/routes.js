import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';

function MainRoutes() {
	return (
		<Routes>
			<Route path="/" element={<App />} />
			<Route path="/home" element={<App />} />

		</Routes>
	);
}

export default MainRoutes;
