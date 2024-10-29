import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import SaleModal from './SaleModal';
import ConfirmModal from './ConfirmModal';
import ErrorModal from './ErrorModal';
import api from '../api';

const Sales = () => {
  const [isModalActive, setModalActive] = useState(false);
  const [isConfirmModalActive, setConfirmModalActive] = useState(false);
  const [editOrCreate, setEditOrCreate] = useState('create');
  const [saleId, setSaleId] = useState(null);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const [formData, setFormData] = useState({
    buyer_name: '',
    sale_date: '',
    quantity_sold: 0,
    total_value: 0
  });
  const [sales, setSales] = useState([]);
  const [apiErrorMessage, setApiErrorMessage] = useState('');

  const [token] = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Vendas Efetuadas";
  }, []);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchSales = async () => {
    try {
      const response = await api.get('/sales', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSales(response.data);
    } catch (error) {
      console.error('Erro ao buscar as vendas:', error);
      setApiErrorMessage(error.response?.data?.detail || 'Erro ao buscar as vendas.');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchSales();
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
      quantity_sold: data.quantity_sold,
      total_value: data.total_value
    });
    setModalActive(true);
  };

  const closeModal = () => {
    setModalActive(false);
  };

  const openConfirmModal = (id) => {
    setSaleToDelete(id);
    setConfirmModalActive(true);
  };

  const closeConfirmModal = () => {
    setSaleToDelete(null);
    setConfirmModalActive(false);
  };

  const handleDelete = async () => {
    if (!saleToDelete) return;

    try {
      await api.delete(`/sales/${saleToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Venda excluída com sucesso!');
      fetchSales();
    } catch (error) {
      console.error('Erro ao excluir a venda:', error);
      setApiErrorMessage(error.response?.data?.detail || 'Erro ao excluir a venda.');
    } finally {
      closeConfirmModal();
    }
  };

  const handleSave = async () => {
    setModalActive(false);
    fetchSales();
  };

  const closeErrorModal = () => {
    setApiErrorMessage('');
  };

  return (
    <div className="box" style={{ width: '80%', margin: '0 auto', padding: '2rem' }}>
      <h1 className="title has-text-centered">Vendas Efetuadas</h1>

      {/* Tabela de vendas */}
      <table className="table is-bordered is-fullwidth mt-4">
        <thead>
          <tr>
            <th>Nome do comprador</th>
            <th>Data da venda</th>
            <th>Quantidade Vendida em Kg</th>
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
                  <button className="button is-small is-danger" onClick={() => openConfirmModal(sale.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="has-text-centered">Nenhuma venda encontrada</td>
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

      <ConfirmModal
        isActive={isConfirmModalActive}
        message="Tem certeza que deseja excluir esta venda?"
        onConfirm={handleDelete}
        onCancel={closeConfirmModal}
      />

      {apiErrorMessage && (
        <ErrorModal message={apiErrorMessage} onClose={closeErrorModal} />
      )}
    </div>
  );
};

export default Sales;
