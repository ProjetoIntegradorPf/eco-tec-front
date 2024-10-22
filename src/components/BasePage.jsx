import Footer from './Footer';
import Header from './Header';

import React from 'react';

const BasePage = ({ children }) => {
	return (
		<div>
			<Header />
			<main className="column">{children}</main>
			<Footer />
		</div>
	);
};

export default BasePage;
