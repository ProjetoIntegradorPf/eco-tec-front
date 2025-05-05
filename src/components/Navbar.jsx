import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faHomeLg } from "@fortawesome/free-solid-svg-icons";
import api from "../api";
import ErrorMessage from "./ErrorMessage";

const Navbar = () => {
  const [token, setToken] = useContext(UserContext); // Estado do token
  const location = useLocation(); // Detecta a rota atual
  const [errorMessage, setErrorMessage] = useState(""); // Estado para mensagem de erro

  const submitLogout = async () => {
    try {
      await api.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      setErrorMessage("Erro ao conectar com o servidor");
    }
  };

  // Função de logout
  const handleLogout = () => {
    submitLogout();
    setToken(null);
    localStorage.removeItem("awesomeTransactionsToken"); // Remove o token do localStorage
  };

  return (
    <nav className="has-background-link-bold is-flex is-justify-content-center is-align-items-center py-2">
      {/* Home */}
      <Link
        to="/home"
        className="navbar-item has-text-white is-flex is-align-items-center"
      >
        <span className="icon">
          <FontAwesomeIcon icon={faHomeLg} size="2x" />
        </span>
        <span className="ml-2 is-size-4 has-text-weight-semi-bold">Home</span>
      </Link>

      <span className="mx-5 has-text-white">|</span>

      {/* Sair */}
      <div
        className="navbar-item has-text-white is-flex is-align-items-center"
        onClick={handleLogout}
        style={{ cursor: "pointer" }}
      >
        <span className="icon">
          <FontAwesomeIcon icon={faSignOutAlt} size="2x" />
        </span>
        <span className="ml-2 is-size-4 has-text-weight-semi-bold">Sair</span>
      </div>

      <ErrorMessage message={errorMessage} />
    </nav>
  );
};

export default Navbar;
