import React, { useEffect, useState } from 'react';
import api from '../api';

const CastrationModal = ({ editOrCreate = 'create', isActive, handleClose, formData, setFormData, token, castrationId, onSave }) => {
  const [errors, setErrors] = useState({}); // Estado para rastrear erros

  // Função para carregar a castração quando estamos no modo de edição
  useEffect(() => {
    const loadCastration = async () => {
      if (editOrCreate === 'edit' && castrationId) {
        try {
          const response = await api.get(`/castrations/${castrationId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setFormData({
            animal_name: response.data.animal_name,
            clinic_name_or_veterinary_name: response.data.clinic_name_or_veterinary_name,
            neutering_date: response.data.neutering_date,
            cost: parseFloat(response.data.cost).toFixed(2).replace('.', ',')
          });
          setErrors({}); // Limpa os erros ao carregar os dados para edição
        } catch (error) {
          console.error('Erro ao carregar a castração:', error);
        }
      }
    };

    if (isActive && editOrCreate === 'edit') {
      loadCastration();
    }

    // Limpa os erros ao abrir o modal para criação ou edição
    if (isActive && editOrCreate === 'create') {
      setErrors({});
    }

  }, [editOrCreate, castrationId, isActive, setFormData, token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // Limpa o erro assim que o campo é preenchido
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const validateFields = () => {
    const newErrors = {};

    if (!formData.animal_name) {
      newErrors.animal_name = 'O nome do animal é obrigatório';
    }

    if (!formData.clinic_name_or_veterinary_name) {
        newErrors.clinic_name_or_veterinary_name = 'O nome do Clínica ou do animal é obrigatório';
      }
      
    if (!formData.neutering_date) {
        newErrors.neutering_date = 'A data da castração é obrigatória';
    }

    if (!formData.cost) {
      newErrors.cost = 'O custo da castração é obrigatório';
    }

    setErrors(newErrors);

    // Retorna true se não houver erros
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }

    const url = editOrCreate === 'create' ? '/castrations' : `/castrations/${castrationId}`;
    const method = editOrCreate === 'create' ? 'POST' : 'PUT';
    formData.cost = parseFloat(String(formData.cost).replace(',', '.'));

    try {
      const response = await api({
        method: method,
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: formData
      });

      console.log('Castração salva com sucesso:', response.data);
      handleClose(); // Fecha o modal após salvar com sucesso
      onSave(); // Chama a função onSave para atualizar a lista de castrações
    } catch (error) {
      console.error('Erro ao salvar a castração:', error);
    }
  };

  const handleModalClose = () => {
    setErrors({}); // Limpa os erros ao fechar o modal
    handleClose(); // Chama a função original de fechar o modal
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{editOrCreate === 'edit' ? 'Editar castração' : 'Registrar castração'}</p>
          <button className="delete" aria-label="close" onClick={handleModalClose}></button>
        </header>
        <section className="modal-card-body">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="field">
              <label className="label">Nome do animal</label>
              <div className="control">
                <input
                  className={`input ${errors.donor_name ? 'is-danger' : ''}`}
                  type="text"
                  name="animal_name"
                  value={formData.animal_name || ''}
                  onChange={handleChange}
                  placeholder="Digite o nome do animal"
                  required
                />
              </div>
              {errors.animal_name && <p className="help is-danger">{errors.animal_name}</p>}
            </div>

            <div className="field">
              <label className="label">Nome da Clínica ou do Veterinário</label>
              <div className="control">
                <input
                  className={`input ${errors.clinic_name_or_veterinary_name ? 'is-danger' : ''}`}
                  type="text"
                  name="clinic_name_or_veterinary_name"
                  value={formData.clinic_name_or_veterinary_name || ''}
                  onChange={handleChange}
                  placeholder="Digite o nome da Clínica ou do Veterinário"
                  required
                />
              </div>
              {errors.clinic_name_or_veterinary_name && <p className="help is-danger">{errors.clinic_name_or_veterinary_name}</p>}
            </div>

            <div className="control">
                <label className="label">Data</label>
                <input
                    className={`input ${errors.neutering_date ? 'is-danger' : ''}`}
                    type="date"
                    name="neutering_date"
                    value={formData?.neutering_date} // Define a data de hoje por padrão
                    onChange={handleChange}
                    required
                />
                {errors.neutering_date && <p className="help is-danger">{errors.neutering_date}</p>}
            </div>

            <div className="field is-grouped">
              <div className="control">
                <label className="label">Custo</label>
                <input
                  className={`input ${errors.cost ? 'is-danger' : ''}`}
                  type="text"
                  name="cost"
                  value={formData.cost || ''}
                  onChange={handleChange}
                  placeholder="Custo"
                  required
                />
                {errors.cost && <p className="help is-danger">{errors.cost}</p>}
              </div>
            </div>
          </form>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-primary mr-4" onClick={handleSubmit}>
            {editOrCreate === 'edit' ? 'Salvar alterações' : 'Registrar'}
          </button>
          <button className="button is-danger" onClick={handleModalClose}>Cancelar</button>
        </footer>
      </div>
    </div>
  );
};

export default CastrationModal;
