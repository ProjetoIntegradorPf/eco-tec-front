import React from "react";
import { Link } from "react-router-dom/dist";

const CardMenu = () => {
  return (
    <div
      className="is-flex is-justify-content-center is-align-items-center"
      style={{ height: "67vh" }}
    >
      <div
        className="box has-text-centered"
        style={{ width: "400px", margin: "0 auto" }}
      >
        <Link
          to="/doacoes"
          className="button is-hovered is-outlined is-fullwidth mb-3 has-text-dark has-text-weight-bold is-size-4"
        >
          Doações
        </Link>
        <Link
          to="/doacoescash"
          className="button is-hovered is-outlined is-fullwidth mb-3 has-text-dark has-text-weight-bold is-size-4"
        >
          Doações em dinheiro
        </Link>
        <Link
          to="/vendas"
          className="button is-hovered is-outlined is-fullwidth mb-3 has-text-dark has-text-weight-bold is-size-4"
        >
          Vendas
        </Link>
        <Link
          to="/castracoes"
          className="button is-hovered is-outlined is-fullwidth mb-3 has-text-dark has-text-weight-bold is-size-4"
        >
          Castrações
        </Link>
        <Link
          to="/resumo-geral"
          className="button is-hovered is-outlined is-fullwidth mb-3 has-text-dark has-text-weight-bold is-size-4"
        >
          Resumo Geral
        </Link>
      </div>
    </div>
  );
};

export default CardMenu;
