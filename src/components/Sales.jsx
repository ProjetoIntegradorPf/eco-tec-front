import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import SaleModal from './SaleModal';
import api from '../api';

const Sales = () => {
  const [isModalActive, setModalActive] = useState(false);
  const [editOrCreate, setEditOrCreate] = useState('create');
  const [saleId, setSaleId] = useState(null);
  const [formData, setFormData] = useState({
    buyer_name: '',
    sale_date: '',
    quantity_sold: 0,
    total_value: 0
  });
  const [sales, setSales] = useState([]); // Estado para armazenar as doações

  const [token] = useContext(UserContext); 
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Vendas Efetuadas"; // Aqui você define o título da aba
  }, []);

  // Verifica se o usuário está logado
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Função para buscar as doações
  const fetchSales = async () => {
    try {
      const response = await api.get('/sales', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setSales(response.data); // Armazena as doações no estado
    } catch (error) {
      console.error('Erro ao buscar as doações:', error);
    }
  };

  // Faz a requisição para buscar as doações ao carregar o componente
  useEffect(() => {
    fetchSales(); // Chama a função de busca ao carregar o componente
  }, [token]);

  const openModalForCreate = () => {
    setEditOrCreate('create');
    setFormData({
        buyer_name: '',
        sale_date: '',
        quantity_sold: 0,
        total_value: 0
    });
    setModalActive(true);
  };

  const openModalForEdit = (id, data) => {
    setEditOrCreate('edit');
    setSaleId(id);
    setFormData({
        buyer_name: data.buyer_name,
        sale_date: data.sale_date,
        quantity_sold: data.sale_date,
        total_value: data.total_value
    });
    setModalActive(true);
  };

  const closeModal = () => {
    setModalActive(false);
  };

  // Função para excluir uma venda
  const deleteSale = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta venda?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/sales/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Venda excluída com sucesso!');
      fetchSales(); // Atualiza a lista após a exclusão
    } catch (error) {
      console.error('Erro ao excluir a venda:', error);
    }
  };

  // Função para ser chamada ao salvar no modal (criar ou editar)
  const handleSave = async () => {
    setModalActive(false); // Fecha o modal após salvar
    fetchSales(); // Atualiza a lista de doações após salvar
  };

  return (
    <div className="box" style={{ width: '80%', margin: '0 auto', padding: '2rem' }}>
      <h1 className="title has-text-centered">Vendas Efetuadas</h1>

      {/* Tabela de doações */}
      <table className="table is-bordered is-fullwidth mt-4">
        <thead>
          <tr>
            <th>Nome do comprador</th>
            <th>Data da venda</th>
            <th>Quantidade Vendida</th>
            <th>Valor total arrecadado na venda</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {sales.length > 0 ? (
            sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.buyer_name}</td>
                <td>{sale.sale_date.split('-').reverse().join('/')}</td>
                <td>{parseFloat(sale.quantity_sold).toFixed(2).replace('.', ',')}</td>
                <td>{parseFloat(sale.total_value).toFixed(2).replace('.', ',')}</td>
                <td>
                  <button className="button is-small is-warning mr-2" onClick={() => openModalForEdit(sale.id, sale)}>
                    Editar
                  </button>
                  <button className="button is-small is-danger" onClick={() => deleteSale(sale.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="has-text-centered">Nenhuma venda encontrada</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="has-text-right">
        <button className="button is-success mt-4" onClick={openModalForCreate}>
          Adicionar venda
        </button>
      </div>

      <SaleModal
        isActive={isModalActive}
        handleClose={closeModal}
        editOrCreate={editOrCreate}
        formData={formData}
        setFormData={setFormData}
        token={token}
        saleId={saleId}
        onSave={handleSave}
      />
    </div>
  );
};

export default Sales;
