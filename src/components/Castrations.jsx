import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import CastrationModal from './CastrationModal';
import api from '../api';

const Castrations = () => {
  const [isModalActive, setModalActive] = useState(false);
  const [editOrCreate, setEditOrCreate] = useState('create');
  const [castrationId, setCastrationId] = useState(null);
  const [formData, setFormData] = useState({
    animal_name: '',
    clinic_name_or_veterinary_name: '',
    neutering_date: '',
    cost: 0.0
  });
  const [castrations, setCastrations] = useState([]); // Estado para armazenar as castrações

  const [token] = useContext(UserContext); 
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Castrações Efetuadas"; // Aqui você define o título da aba
  }, []);

  // Verifica se o usuário está logado
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Função para buscar as castrações
  const fetchCastrations = async () => {
    try {
      const response = await api.get('/castrations', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCastrations(response.data); // Armazena as castrações no estado
    } catch (error) {
      console.error('Erro ao buscar as castrações:', error);
    }
  };

  // Faz a requisição para buscar as castrações ao carregar o componente
  useEffect(() => {
    fetchCastrations(); // Chama a função de busca ao carregar o componente
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

  // Função para excluir uma castração
  const deleteCastration = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta castração?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/castrations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Castração excluída com sucesso!');
      fetchCastrations(); // Atualiza a lista após a exclusão
    } catch (error) {
      console.error('Erro ao excluir a castração:', error);
    }
  };

  // Função para ser chamada ao salvar no modal (criar ou editar)
  const handleSave = async () => {
    setModalActive(false); // Fecha o modal após salvar
    fetchCastrations(); // Atualiza a lista de castrações após salvar
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
                  <button className="button is-small is-danger" onClick={() => deleteCastration(castration.id)}>
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
    </div>
  );
};

export default Castrations;
