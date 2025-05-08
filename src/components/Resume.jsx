import React, { useEffect, useState, useContext } from "react";
import api from "../api";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Resume = () => {
  const [token] = useContext(UserContext);
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState({
    donations: 0,
    total_caps_sold: 0,
    total_caps_value_sold: 0,
    total_castration_value: 0,
    qtd_castrations: 0,
    balance: 0,
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const fetchSummaryData = async () => {
    try {
      const response = await api.get("/reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const donations = response.data.reduce(
        (acc, item) => acc + item.donation,
        0
      );
      const totalCaps = response.data.reduce(
        (acc, item) => acc + item.sale_qtd_sold,
        0
      );
      const totalValueCaps = response.data.reduce(
        (acc, item) => acc + item.sale_value,
        0
      );
      const totalCashDonations = response.data.reduce(
        (acc, item) => acc + (item.cash_donation || 0),
        0
      );
      const totalValueCastration = response.data.reduce(
        (acc, item) => acc + item.castration_value,
        0
      );
      const qtdCastrations = response.data.reduce(
        (count, item) => (item.castration_id !== null ? count + 1 : count),
        0
      );

      setSummaryData({
        donations,
        total_caps_sold: totalCaps,
        total_caps_value_sold: totalValueCaps + totalCashDonations,
        total_castration_value: totalValueCastration,
        qtd_castrations: qtdCastrations,
        balance: totalValueCaps + totalCashDonations - totalValueCastration,
      });
    } catch (error) {
      console.error("Erro ao buscar dados do resumo geral:", error);
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const cardStyle = "box has-text-centered has-background-light p-5";
  const titleStyle = "subtitle has-text-weight-bold has-text-primary mb-2";
  const valueStyle = "is-size-1 has-text-weight-bold has-text-dark";

  return (
    <div className="container mb-6">
      <h1 className="title has-text-centered my-6">📊 Resumo Geral</h1>

      <div className="columns is-multiline">
        {/* Total de Doações de Tampinhas Recebidas */}
        <div className="column is-one-third">
          <div className={cardStyle}>
            <h2 className={titleStyle}>🛍️ Doações Recebidas</h2>
            <p className={valueStyle}>{summaryData.donations} Kg</p>
          </div>
        </div>

        {/* Doações em Dinheiro */}
        <div className="column is-one-third">
          <div className={cardStyle}>
            <h2 className={titleStyle}>💰 Doações em Dinheiro</h2>
            <p className={valueStyle}>
              R${" "}
              {summaryData.total_caps_value_sold.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Total de Tampinhas Vendidas */}
        <div className="column is-one-third">
          <div className={cardStyle}>
            <h2 className={titleStyle}>⚖️ Tampinhas Vendidas</h2>
            <p className={valueStyle}>{summaryData.total_caps_sold} Kg</p>
          </div>
        </div>

        {/* Número Total de Castrações Realizadas */}
        <div className="column is-one-third">
          <div className={cardStyle}>
            <h2 className={titleStyle}>🐶 Castrações Realizadas</h2>
            <p className={valueStyle}>{summaryData.qtd_castrations}</p>
          </div>
        </div>

        {/* Valor Total Arrecadado */}
        <div className="column is-one-third">
          <div className={cardStyle}>
            <h2 className={titleStyle}>📈 Total Arrecadado</h2>
            <p className={valueStyle}>
              R${" "}
              {summaryData.total_caps_value_sold.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Despesas */}
        <div className="column is-one-third">
          <div className={cardStyle}>
            <h2 className={titleStyle}>📉 Despesas</h2>
            <p className={valueStyle}>
              R${" "}
              {summaryData.total_castration_value.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Valor Total Gasto */}
        <div className="column is-half">
          <div className={cardStyle}>
            <h2 className={titleStyle}>💸 Valor Gasto em Castrações</h2>
            <p className={valueStyle}>
              R${" "}
              {summaryData.total_castration_value.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Saldo */}
        <div className="column is-half">
          <div
            className={`${cardStyle} has-background-primary-light`}
            style={{ border: "2px solid #00d1b2" }}
          >
            <h2 className="subtitle has-text-weight-bold has-text-primary-dark mb-2">
              📝 Saldo Final
            </h2>
            <p className="is-size-1 has-text-weight-bold has-text-black">
              R${" "}
              {summaryData.balance.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
