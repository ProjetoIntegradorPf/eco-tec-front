// src/api.js
import axios from 'axios';

// Criar instância do axios com a URL base da API
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL base da API
  headers: {
    'Content-Type': 'application/json', // Defina o formato das requisições
  },
});

export default api; // Exportando como default
