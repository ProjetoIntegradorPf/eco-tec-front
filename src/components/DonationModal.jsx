import React, { useEffect } from 'react';
import api from '../api';

const DonationModal = ({ editOrCreate = 'create', isActive, handleClose, formData, setFormData, token, donationId, onSave }) => {

  // Função para carregar a doação quando estamos no modo de edição
  useEffect(() => {
    const loadDonation = async () => {
      if (editOrCreate === 'edit' && donationId) {
        try {
          const response = await api.get(`/donations/${donationId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log(response)
          setFormData({
            donor_name: response.data.donor_name,
            quantity: response.data.quantity,
            donation_date: response.data.donation_date // Ajuste de formato da data
          });
        } catch (error) {
          console.error('Erro ao carregar a doação:', error);
        }
      }
    };

    if (isActive && editOrCreate === 'edit') {
      loadDonation();
    }
  }, [editOrCreate, donationId, isActive, setFormData, token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    const url = editOrCreate === 'create' ? '/donations' : `/donations/${donationId}`;
    const method = editOrCreate === 'create' ? 'POST' : 'PUT';
    formData.quantity = parseFloat(formData.quantity)
    console.log(formData.donation_date)

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

      console.log('Doação salva com sucesso:', response.data);
      handleClose(); // Fecha o modal após salvar com sucesso
      onSave(); // Chama a função onSave para atualizar a lista de doações
    } catch (error) {
      console.error('Erro ao salvar a doação:', error);
    }
  };

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{editOrCreate === 'edit' ? 'Editar doação' : 'Registrar doação'}</p>
          <button className="delete" aria-label="close" onClick={handleClose}></button>
        </header>
        <section className="modal-card-body">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="field">
              <label className="label">Nome do doador</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="donor_name"
                  value={formData.donor_name || ''}
                  onChange={handleChange}
                  placeholder="Digite o nome do doador"
                  required
                />
              </div>
            </div>

            <div className="field is-grouped">
              <div className="control">
                <label className="label">Quantidade</label>
                <input
                  className="input"
                  type="number"
                  name="quantity"
                  value={formData.quantity || ''}
                  onChange={handleChange}
                  placeholder="Quantidade"
                  required
                />
              </div>
              <div className="control">
                <label className="label">Data</label>
                <input
                    className="input"
                    type="date"
                    name="donation_date"
                    value={formData.donation_date || new Date().toISOString().split('T')[0]}
                    onChange={handleChange}
                    required
                />
              </div>
            </div>
          </form>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-primary mr-4" onClick={handleSubmit}>
            {editOrCreate === 'edit' ? 'Salvar alterações' : 'Registrar'}
          </button>
          <button className="button is-danger" onClick={handleClose}>Cancelar</button>
        </footer>
      </div>
    </div>
  );
};

export default DonationModal;
