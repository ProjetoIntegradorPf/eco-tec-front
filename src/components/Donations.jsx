import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import DonationModal from './DonationModal';
import api from '../api';

const Donations = () => {
  const [isModalActive, setModalActive] = useState(false);
  const [editOrCreate, setEditOrCreate] = useState('create');
  const [donationId, setDonationId] = useState(null);
  const [formData, setFormData] = useState({
    donor_name: '',
    quantity: '',
    donation_date: ''
  });
  const [donations, setDonations] = useState([]); // Estado para armazenar as doações

  const [token] = useContext(UserContext); 
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Doações Recebidas"; // Aqui você define o título da aba
  }, []);

  // Verifica se o usuário está logado
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Função para buscar as doações
  const fetchDonations = async () => {
    try {
      const response = await api.get('/donations', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDonations(response.data); // Armazena as doações no estado
    } catch (error) {
      console.error('Erro ao buscar as doações:', error);
    }
  };

  // Faz a requisição para buscar as doações ao carregar o componente
  useEffect(() => {
    fetchDonations(); // Chama a função de busca ao carregar o componente
  }, [token]);

  const openModalForCreate = () => {
    setEditOrCreate('create');
    setFormData({
      donor_name: '',
      quantity: '',
      donation_date: ''
    });
    setModalActive(true);
  };

  const openModalForEdit = (id, data) => {
    setEditOrCreate('edit');
    setDonationId(id);
    setFormData({
      donor_name: data.donor_name,
      quantity: data.quantity,
      donation_date: data.donation_date
    });
    setModalActive(true);
  };

  const closeModal = () => {
    setModalActive(false);
  };

  // Função para excluir uma doação
  const deleteDonation = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta doação?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/donations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Doação excluída com sucesso!');
      fetchDonations(); // Atualiza a lista após a exclusão
    } catch (error) {
      console.error('Erro ao excluir a doação:', error);
    }
  };

  // Função para ser chamada ao salvar no modal (criar ou editar)
  const handleSave = async () => {
    setModalActive(false); // Fecha o modal após salvar
    fetchDonations(); // Atualiza a lista de doações após salvar
  };

  return (
    <div className="box" style={{ width: '80%', margin: '0 auto', padding: '2rem' }}>
      <h1 className="title has-text-centered">Doações Recebidas</h1>

      {/* Tabela de doações */}
      <table className="table is-bordered is-fullwidth mt-4">
        <thead>
          <tr>
            <th>Doador</th>
            <th>Quantidade</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {donations.length > 0 ? (
            donations.map((donation) => (
              <tr key={donation.id}>
                <td>{donation.donor_name}</td>
                <td>{donation.quantity}</td>
                <td>{donation.donation_date.split('-').reverse().join('/')}</td>
                <td>
                  <button className="button is-small is-warning mr-2" onClick={() => openModalForEdit(donation.id, donation)}>
                    Editar
                  </button>
                  <button className="button is-small is-danger" onClick={() => deleteDonation(donation.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="has-text-centered">Nenhuma doação encontrada</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="has-text-right">
        <button className="button is-success mt-4" onClick={openModalForCreate}>
          Adicionar doação
        </button>
      </div>

      <DonationModal
        isActive={isModalActive}
        handleClose={closeModal}
        editOrCreate={editOrCreate}
        formData={formData}
        setFormData={setFormData}
        token={token}
        donationId={donationId}
        onSave={handleSave}
      />
    </div>
  );
};

export default Donations;
