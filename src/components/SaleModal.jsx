import React, { useEffect, useState } from 'react';
import ErrorModal from './ErrorModal'; // Importa o ErrorModal
import api from '../api';

const SaleModal = ({ editOrCreate = 'create', isActive, handleClose, formData, setFormData, token, saleId, onSave }) => {
  const [errors, setErrors] = useState({}); // Estado para rastrear erros
  const [apiErrorMessage, setApiErrorMessage] = useState(''); // Estado para mensagens de erro da API

  // Função para carregar a venda quando estamos no modo de edição
  useEffect(() => {
    const loadSale = async () => {
      if (editOrCreate === 'edit' && saleId) {
        try {
          const response = await api.get(`/sales/${saleId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setFormData({
            buyer_name: response.data.buyer_name,
            sale_date: response.data.sale_date,
            quantity_sold: response.data.quantity_sold,
            total_value: response.data.total_value
          });
          setErrors({}); // Limpa os erros ao carregar os dados para edição
        } catch (error) {
          console.error('Erro ao carregar a venda:', error);
          setApiErrorMessage(error.response?.data?.detail || 'Erro ao carregar a venda.');
        }
      }
    };

    if (isActive && editOrCreate === 'edit') {
      loadSale();
    }

    // Limpa os erros ao abrir o modal para criação ou edição
    if (isActive && editOrCreate === 'create') {
      setErrors({});
    }

  }, [editOrCreate, saleId, isActive, setFormData, token]);

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
    if (!formData.buyer_name) {
      newErrors.buyer_name = 'O nome do comprador é obrigatório';
    }

    if (!formData.quantity_sold) {
      newErrors.quantity_sold = 'A quantidade vendida é obrigatória';
    }

    if (!formData.sale_date) {
      newErrors.sale_date = 'A data da venda é obrigatória';
    }

    if (!formData.total_value) {
      newErrors.total_value = 'O valor total é obrigatório';
    }

    setErrors(newErrors);

    // Retorna true se não houver erros
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Verifica se há erros antes de submeter
    if (!validateFields()) {
      return;
    }

    const url = editOrCreate === 'create' ? '/sales' : `/sales/${saleId}`;
    const method = editOrCreate === 'create' ? 'POST' : 'PUT';
    formData.quantity_sold = parseFloat(String(formData.quantity_sold).replace(',', '.'));
    formData.total_value = parseFloat(String(formData.total_value).replace(',', '.'));

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

      console.log('Venda salva com sucesso:', response.data);
      handleClose(); // Fecha o modal após salvar com sucesso
      onSave(); // Chama a função onSave para atualizar a lista de vendas
    } catch (error) {
      console.error('Erro ao salvar a venda:', error);
      setApiErrorMessage(error.response?.data?.detail || 'Erro ao salvar a venda.');
    }
  };

  const handleModalClose = () => {
    setErrors({}); // Limpa os erros ao fechar o modal
    handleClose(); // Chama a função original de fechar o modal
  };

  const closeErrorModal = () => {
    setApiErrorMessage(''); // Limpa a mensagem de erro da API
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{editOrCreate === 'edit' ? 'Editar venda' : 'Registrar venda'}</p>
          <button className="delete" aria-label="close" onClick={handleModalClose}></button>
        </header>
        <section className="modal-card-body">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="field">
              <label className="label">Nome do Comprador</label>
              <div className="control">
                <input
                  className={`input ${errors.buyer_name ? 'is-danger' : ''}`}
                  type="text"
                  name="buyer_name"
                  value={formData.buyer_name || ''}
                  onChange={handleChange}
                  placeholder="Digite o nome do comprador"
                  required
                />
              </div>
              {errors.buyer_name && <p className="help is-danger">{errors.buyer_name}</p>}
            </div>

            <div className="field">
              <label className="label">Quantidade Vendida em Kg</label>
              <div className="control">
                <input
                  className={`input ${errors.quantity_sold ? 'is-danger' : ''}`}
                  type="text"
                  name="quantity_sold"
                  value={formData.quantity_sold || ''}
                  onChange={handleChange}
                  placeholder="Quantidade vendida"
                  required
                />
                {errors.quantity_sold && <p className="help is-danger">{errors.quantity_sold}</p>}
              </div>
            </div>

            <div className="field">
              <label className="label">Valor Total</label>
              <div className="control">
                <input
                  className={`input ${errors.total_value ? 'is-danger' : ''}`}
                  type="text"
                  name="total_value"
                  value={formData.total_value || ''}
                  onChange={handleChange}
                  placeholder="Valor total"
                  required
                />
                {errors.total_value && <p className="help is-danger">{errors.total_value}</p>}
              </div>
            </div>

            <div className="field">
              <label className="label">Data da Venda</label>
              <div className="control">
                <input
                  className={`input ${errors.sale_date ? 'is-danger' : ''}`}
                  type="date"
                  name="sale_date"
                  value={formData.sale_date || ''} // Define a data de hoje por padrão
                  onChange={handleChange}
                  required
                />
                {errors.sale_date && <p className="help is-danger">{errors.sale_date}</p>}
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

      {/* Error Modal */}
      {apiErrorMessage && (
        <ErrorModal message={apiErrorMessage} onClose={closeErrorModal} />
      )}
    </div>
  );
};

export default SaleModal;
