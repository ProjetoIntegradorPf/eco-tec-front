import React, { useEffect, useState } from 'react';
import api from '../api';

const Resume = () => {
  const [summaryData, setSummaryData] = useState({
    totalDonations: 0, // Total de tampinhas recebidas (em Kg)
    totalSalesKg: 0,   // Total de tampinhas vendidas (em Kg)
    totalSalesValue: 0, // Valor arrecadado
    totalNeutering: 0,  // Total de castrações realizadas
    totalValueNeuterings: 0,
    total: 0
  });

  const fetchSummaryData = async () => {
    try {
      const response = await api.get('/summary'); // Ajuste para a rota correta
      setSummaryData({
        totalDonations: response.data.totalDonations,
        totalSalesKg: response.data.totalSalesKg,
        totalSalesValue: response.data.totalSalesValue,
        totalNeutering: response.data.totalNeutering
      });
    } catch (error) {
      console.error('Erro ao buscar dados do resumo geral:', error);
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, []);

  return (
    <div className="container">
      <h1 className="title has-text-centered">Resumo Geral</h1>

      <div className="columns is-multiline mt-5">
        {/* Total de Doações de Tampinhas Recebidas */}
        <div className="column is-one-third">
          <div className="box has-text-centered">
            <h2 className="subtitle">Total de Doações Recebidas</h2>
            <p className="is-size-1 has-text-weight-bold">
              {summaryData.totalDonations} Kg
            </p>
          </div>
        </div>

        {/* Total de Tampinhas Vendidas e Valor Arrecadado */}
        <div className="column is-one-third">
          <div className="box has-text-centered">
            <h2 className="subtitle">Total de Tampinhas Vendidas</h2>
            <p className="is-size-1 has-text-weight-bold">
              {summaryData.totalSalesKg} Kg
            </p>
          </div>
        </div>

        {/* Número Total de Castrações Realizadas */}
        <div className="column is-one-third">
          <div className="box has-text-centered">
            <h2 className="subtitle">Castrações Realizadas</h2>
            <p className="is-size-1 has-text-weight-bold">
              {summaryData.totalNeutering}
            </p>
          </div>
        </div>

        <div className="column is-one-third">
          <div className="box has-text-centered">
            <h2 className="subtitle">Valor Total Arrecadado</h2>
            <p className="is-size-1 has-text-weight-bold">
            R$ {summaryData.totalSalesValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="column is-one-third">
          <div className="box has-text-centered">
            <h2 className="subtitle">Valor Total Gasto</h2>
            <p className="is-size-1 has-text-weight-bold">
            R$ {summaryData.totalValueNeuterings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="column is-one-third">
          <div className="box has-text-centered">
            <h2 className="subtitle">Saldo</h2>
            <p className="is-size-1 has-text-weight-bold">
            R$ {summaryData.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
