// src/api.js
import axios from 'axios';

// Criar instância do axios com a URL base da API
const api = axios.create({
  baseURL: 'https://eco-tec-api.onrender.com/api', // URL base da API
  headers: {
    'Content-Type': 'application/json', // Defina o formato das requisições
  },
});

// Adiciona o interceptor para tratar erros de autenticação (401/403)
api.interceptors.response.use(
  (response) => response, // Para respostas de sucesso, apenas retorna a resposta.
  (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      // Se o status for 401 ou 403, redireciona para a página de login
      window.location.href = '/login';
    }
    return Promise.reject(error); // Propaga o erro para ser tratado pelo código que fez a requisição
  }
);

export default api;
