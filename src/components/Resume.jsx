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
        (acc, donationreduce) => acc + donationreduce.donation,
        0
      );
      const totalCaps = response.data.reduce(
        (acc, tampinhaVndida) => acc + tampinhaVndida.sale_qtd_sold,
        0
      );
      const totalValueCaps = response.data.reduce(
        (acc, tampinhaVndida) => acc + tampinhaVndida.sale_value,
        0
      );
      const totalValueCastration = response.data.reduce(
        (acc, castracao) => acc + castracao.castration_value,
        0
      );
      const qtdCastrations = response.data.reduce((count, item) => {
        return item.castration_id !== null ? count + 1 : count;
      }, 0);

      setSummaryData({
        donations: donations,
        total_caps_sold: totalCaps,
        total_caps_value_sold: totalValueCaps,
        total_castration_value: totalValueCastration,
        qtd_castrations: qtdCastrations,
        balance: totalValueCaps - totalValueCastration,
      });
    } catch (error) {
      console.error("Erro ao buscar dados do resumo geral:", error);
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, []);

  return (
    <div className="container">
      <h1 className="title has-text-centered">Resumo Geral</h1>

      <div className="columns is-multiline my-5">
        {/* Total de Doações de Tampinhas Recebidas */}
        <div className="column is-one-third">
          <div className="box has-text-centered">
            <h2 className="subtitle">Total de Doações Recebidas</h2>
            <p className="is-size-1 has-text-weight-bold">
              {summaryData.donations} Kg
            </p>
          </div>
        </div>

        {/* Total de Tampinhas Vendidas */}
        <div className="column is-one-third">
          <div className="box has-text-centered">
            <h2 className="subtitle">Total de Tampinhas Vendidas</h2>
            <p className="is-size-1 has-text-weight-bold">
              {summaryData.total_caps_sold} Kg
            </p>
          </div>
        </div>

        {/* Número Total de Castrações Realizadas */}
        <div className="column is-one-third">
          <div className="box has-text-centered">
            <h2 className="subtitle">Castrações Realizadas</h2>
            <p className="is-size-1 has-text-weight-bold">
              {summaryData.qtd_castrations}
            </p>
          </div>
        </div>

        {/* Valor Total Arrecadado */}
        <div className="column is-one-third">
          <div className="box has-text-centered">
            <h2 className="subtitle">Valor Total Arrecadado</h2>
            <p className="is-size-1 has-text-weight-bold">
              R${" "}
              {summaryData.total_caps_value_sold.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Valor Total Gasto */}
        <div className="column is-one-third">
          <div className="box has-text-centered">
            <h2 className="subtitle">Valor Total Gasto</h2>
            <p className="is-size-1 has-text-weight-bold">
              R${" "}
              {summaryData.total_castration_value.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Saldo */}
        <div className="column is-one-third">
          <div className="box has-text-centered">
            <h2 className="subtitle">Saldo</h2>
            <p className="is-size-1 has-text-weight-bold">
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
