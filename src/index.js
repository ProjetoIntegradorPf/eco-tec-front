import React from 'react';
import ReactDOM from 'react-dom/client'; // Importando da nova API
import { BrowserRouter as Router } from 'react-router-dom';
import MainRoutes from './routes'; // Importando as rotas
import { UserProvider } from './context/UserContext'; // Importando o contexto do usuário
import 'bulma/css/bulma.min.css';


// Pega o elemento root no DOM
const rootElement = document.getElementById('root');

// Cria um root a partir do elemento no DOM
const root = ReactDOM.createRoot(rootElement);

// Renderiza a aplicação usando o novo método
root.render(
  <React.StrictMode>
    <Router> {/* Envolvendo com Router para navegação */}
      <UserProvider> {/* Envolvendo com UserProvider para gerenciar estado do usuário */}
        <MainRoutes /> {/* Renderiza as rotas principais */}
      </UserProvider>
    </Router>
  </React.StrictMode>
);
