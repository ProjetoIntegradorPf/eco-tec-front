import React, { useContext } from 'react';
import Footer from './Footer';
import Header from './Header';
import Login from './Login';
import { UserContext } from '../context/UserContext';

const BasePage = ({ showLogin, Component  }) => {
    const [token] = useContext(UserContext);

    return (
        <div>
            <Header />
            <main className="column">
                {showLogin ? (
                    <div className="columns is-centered is-vcentered is-flex is-justify-content-center mt-6">
                        <div className="column is-one-third">
                            <Login />
                        </div>
                    </div>
                ) : (
                    <Component /> 
                )}
            </main>
            <Footer />
        </div>
    );
};

export default BasePage;
