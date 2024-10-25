import React, { useContext } from 'react';
import Footer from './Footer';
import Header from './Header';
import Navbar from './Navbar';
import Login from './Login'; // Importa o Login
import { UserContext } from '../context/UserContext'; // Importa o contexto de autenticação
import CardMenu from './CardMenu';

const BasePage = ({ showLogin, Component  }) => {
    const [token] = useContext(UserContext); // Verifica se o usuário está logado

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
