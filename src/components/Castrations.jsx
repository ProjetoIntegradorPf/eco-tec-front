import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import CastrationModal from './CastrationModal';
import ConfirmModal from './ConfirmModal'; // Importa o ConfirmModal
import ErrorModal from './ErrorModal';
import api from '../api';

const Castrations = () => {
  const [isModalActive, setModalActive] = useState(false);
  const [isConfirmModalActive, setConfirmModalActive] = useState(false); // Estado para o ConfirmModal
  const [editOrCreate, setEditOrCreate] = useState('create');
  const [castrationId, setCastrationId] = useState(null);
  const [castrationToDelete, setCastrationToDelete] = useState(null); // Armazena o ID para exclusão
  const [formData, setFormData] = useState({
    animal_name: '',
    clinic_name_or_veterinary_name: '',
    neutering_date: '',
    cost: 0.0
  });
  const [castrations, setCastrations] = useState([]);
  const [apiErrorMessage, setApiErrorMessage] = useState('');

  const [token] = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Castrações Efetuadas";
  }, []);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchCastrations = async () => {
    try {
      const response = await api.get('/castrations', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCastrations(response.data);
    } catch (error) {
      console.error('Erro ao buscar as castrações:', error);
      setApiErrorMessage(error.response?.data?.detail || 'Erro ao buscar as castrações.');
    }
  };

  useEffect(() => {
    fetchCastrations();
  }, [token]);

  const openModalForCreate = () => {
    setEditOrCreate('create');
    setFormData({
      animal_name: '',
      clinic_name_or_veterinary_name: '',
      neutering_date: '',
      cost: 0.0
    });
    setModalActive(true);
  };

  const openModalForEdit = (id, data) => {
    setEditOrCreate('edit');
    setCastrationId(id);
    setFormData({
      animal_name: data.animal_name,
      clinic_name_or_veterinary_name: data.clinic_name_or_veterinary_name,
      neutering_date: data.neutering_date,
      cost: data.cost
    });
    setModalActive(true);
  };

  const closeModal = () => {
    setModalActive(false);
  };

  const openConfirmModal = (id) => {
    setCastrationToDelete(id);
    setConfirmModalActive(true);
  };

  const closeConfirmModal = () => {
    setCastrationToDelete(null);
    setConfirmModalActive(false);
  };

  const handleDelete = async () => {
    if (!castrationToDelete) return;

    try {
      await api.delete(`/castrations/${castrationToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Castração excluída com sucesso!');
      fetchCastrations();
    } catch (error) {
      console.error('Erro ao excluir a castração:', error);
      setApiErrorMessage(error.response?.data?.detail || 'Erro ao excluir a castração.');
    } finally {
      closeConfirmModal();
    }
  };

  const handleSave = async () => {
    setModalActive(false);
    fetchCastrations();
  };

  const closeErrorModal = () => {
    setApiErrorMessage('');
  };

  return (
    <div className="box" style={{ width: '80%', margin: '0 auto', padding: '2rem' }}>
      <h1 className="title has-text-centered">Castrações Efetuadas</h1>

      {/* Tabela de castrações */}
      <table className="table is-bordered is-fullwidth mt-4">
        <thead>
          <tr>
            <th>Nome do animal</th>
            <th>Nome da Clínica ou do Veterinário</th>
            <th>Data</th>
            <th>Custo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {castrations.length > 0 ? (
            castrations.map((castration) => (
              <tr key={castration.id}>
                <td>{castration.animal_name}</td>
                <td>{castration.clinic_name_or_veterinary_name}</td>
                <td>{castration.neutering_date.split('-').reverse().join('/')}</td>
                <td>{parseFloat(castration.cost).toFixed(2).replace('.', ',')}</td>
                <td>
                  <button className="button is-small is-warning mr-2" onClick={() => openModalForEdit(castration.id, castration)}>
                    Editar
                  </button>
                  <button className="button is-small is-danger" onClick={() => openConfirmModal(castration.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="has-text-centered">Nenhuma castração encontrada</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="has-text-right">
        <button className="button is-success mt-4" onClick={openModalForCreate}>
          Adicionar castração
        </button>
      </div>

      <CastrationModal
        isActive={isModalActive}
        handleClose={closeModal}
        editOrCreate={editOrCreate}
        formData={formData}
        setFormData={setFormData}
        token={token}
        castrationId={castrationId}
        onSave={handleSave}
      />

      <ConfirmModal
        isActive={isConfirmModalActive}
        message="Tem certeza que deseja excluir esta castração?"
        onConfirm={handleDelete}
        onCancel={closeConfirmModal}
      />

      {apiErrorMessage && (
        <ErrorModal message={apiErrorMessage} onClose={closeErrorModal} />
      )}
    </div>
  );
};

export default Castrations;
