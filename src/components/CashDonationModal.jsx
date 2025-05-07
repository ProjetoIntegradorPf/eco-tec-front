import React, { useEffect, useState } from "react";
import ErrorModal from "./ErrorModal"; // Importa o ErrorModal
import api from "../api";

const CashDonationsModal = ({
  editOrCreate = "create",
  isActive,
  handleClose,
  formData,
  setFormData,
  token,
  donationId,
  onSave,
}) => {
  const [errors, setErrors] = useState({}); // Estado para rastrear erros
  const [apiErrorMessage, setApiErrorMessage] = useState(""); // Estado para mensagens de erro da API

  // Função para carregar a doação quando estamos no modo de edição
  useEffect(() => {
    const loadDonation = async () => {
      if (editOrCreate === "edit" && donationId) {
        try {
          const response = await api.get(`/cash-donations/${donationId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setFormData({
            donor_name: response.data.donor_name,
            quantity: parseFloat(response.data.quantity)
              .toFixed(2)
              .replace(".", ","),
            donation_date: response.data.donation_date, // Ajuste de formato da data
          });
          setErrors({}); // Limpa os erros ao carregar os dados para edição
        } catch (error) {
          console.error("Erro ao carregar a doação:", error);
          setApiErrorMessage(
            error.response?.data?.detail || "Erro ao carregar a doação."
          );
        }
      }
    };

    if (isActive && editOrCreate === "edit") {
      loadDonation();
    }

    // Limpa os erros ao abrir o modal para criação ou edição
    if (isActive && editOrCreate === "create") {
      setErrors({});
    }
  }, [editOrCreate, donationId, isActive, setFormData, token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Limpa o erro assim que o campo é preenchido
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validateFields = () => {
    const newErrors = {};

    if (!formData.donor_name) {
      newErrors.donor_name = "O nome do doador é obrigatório";
    }

    if (!formData.quantity) {
      newErrors.quantity = "O valor é obrigatório";
    }

    if (!formData.donation_date) {
      newErrors.donation_date = "A data da doação é obrigatória";
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

    const url =
      editOrCreate === "create"
        ? "/cash-donations"
        : `/cash-donations/${donationId}`;
    const method = editOrCreate === "create" ? "POST" : "PUT";
    formData.quantity = parseFloat(String(formData.quantity).replace(",", "."));

    try {
      const response = await api({
        method: method,
        url: url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      });

      console.log("Doação salva com sucesso:", response.data);
      handleClose(); // Fecha o modal após salvar com sucesso
      onSave(); // Chama a função onSave para atualizar a lista de doações
    } catch (error) {
      console.error("Erro ao salvar a doação:", error);
      setApiErrorMessage(
        error.response?.data?.detail || "Erro ao salvar a doação."
      );
    }
  };

  const handleModalClose = () => {
    setErrors({}); // Limpa os erros ao fechar o modal
    handleClose(); // Chama a função original de fechar o modal
  };

  const closeErrorModal = () => {
    setApiErrorMessage(""); // Limpa a mensagem de erro da API
  };

  return (
    <div className={`modal ${isActive ? "is-active" : ""}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            {editOrCreate === "edit" ? "Editar doação" : "Registrar doação"}
          </p>
          <button
            className="delete"
            aria-label="close"
            onClick={handleModalClose}
          ></button>
        </header>
        <section className="modal-card-body">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="field">
              <label className="label">Nome do doador</label>
              <div className="control">
                <input
                  className={`input ${errors.donor_name ? "is-danger" : ""}`}
                  type="text"
                  name="donor_name"
                  value={formData.donor_name || ""}
                  onChange={handleChange}
                  placeholder="Digite o nome do doador"
                  required
                />
              </div>
              {errors.donor_name && (
                <p className="help is-danger">{errors.donor_name}</p>
              )}
            </div>
            <div className="field is-grouped">
              <div className="control">
                <label className="label">Valor em reais</label>
                <input
                  className={`input ${errors.quantity ? "is-danger" : ""}`}
                  type="text"
                  name="quantity"
                  value={formData.quantity || ""}
                  onChange={handleChange}
                  placeholder="Quantidade"
                  required
                />
                {errors.quantity && (
                  <p className="help is-danger">{errors.quantity}</p>
                )}
              </div>
              <div className="control">
                <label className="label">Data</label>
                <input
                  className={`input ${errors.donation_date ? "is-danger" : ""}`}
                  type="date"
                  name="donation_date"
                  value={formData?.donation_date} // Define a data de hoje por padrão
                  onChange={handleChange}
                  required
                />
                {errors.donation_date && (
                  <p className="help is-danger">{errors.donation_date}</p>
                )}
              </div>
            </div>
          </form>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-primary mr-4" onClick={handleSubmit}>
            {editOrCreate === "edit" ? "Salvar alterações" : "Registrar"}
          </button>
          <button className="button is-danger" onClick={handleModalClose}>
            Cancelar
          </button>
        </footer>
      </div>

      {/* Error Modal */}
      {apiErrorMessage && (
        <ErrorModal message={apiErrorMessage} onClose={closeErrorModal} />
      )}
    </div>
  );
};

export default CashDonationsModal;
