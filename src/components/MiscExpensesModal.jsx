import React, { useEffect, useState } from "react";
import ErrorModal from "./ErrorModal";
import api from "../api";

const MiscExpensesModal = ({
  editOrCreate = "create",
  isActive,
  handleClose,
  formData,
  setFormData,
  token,
  expenseId,
  onSave,
}) => {
  const [errors, setErrors] = useState({});
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  useEffect(() => {
    const loadExpense = async () => {
      if (editOrCreate === "edit" && expenseId) {
        try {
          const response = await api.get(`/misc-expenses/${expenseId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setFormData({
            description: response.data.description,
            expense_date: response.data.expense_date.split("T")[0],
            value: response.data.value,
          });
          setErrors({});
        } catch (error) {
          console.error("Erro ao carregar despesa:", error);
          setApiErrorMessage(
            error.response?.data?.detail || "Erro ao carregar a despesa."
          );
        }
      }
    };

    if (isActive) {
      if (editOrCreate === "edit") {
        loadExpense();
      } else {
        setErrors({});
        setFormData({
          description: "",
          expense_date: "",
          value: "",
        });
      }
    }
  }, [editOrCreate, expenseId, isActive, setFormData, token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formData.description) newErrors.description = "Descrição obrigatória";
    if (!formData.value) newErrors.value = "Valor obrigatório";
    if (!formData.expense_date)
      newErrors.expense_date = "Data da despesa obrigatória";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    const url =
      editOrCreate === "create"
        ? "/misc-expenses"
        : `/misc-expenses/${expenseId}`;
    const method = editOrCreate === "create" ? "POST" : "PUT";

    const payload = {
      description: formData.description,
      expense_date: `${formData.expense_date}T00:00:00Z`,
      value: parseFloat(String(formData.value).replace(",", ".")),
    };

    try {
      const response = await api({
        method: method,
        url: url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: payload,
      });

      console.log("Despesa salva:", response.data);
      handleClose();
      onSave();
    } catch (error) {
      console.error("Erro ao salvar despesa:", error);
      setApiErrorMessage(
        error.response?.data?.detail || "Erro ao salvar a despesa."
      );
    }
  };

  const handleModalClose = () => {
    setErrors({});
    handleClose();
  };

  const closeErrorModal = () => {
    setApiErrorMessage("");
  };

  return (
    <div className={`modal ${isActive ? "is-active" : ""}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            {editOrCreate === "edit" ? "Editar Despesa" : "Registrar Despesa"}
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
              <label className="label">Descrição</label>
              <div className="control">
                <input
                  className={`input ${errors.description ? "is-danger" : ""}`}
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descrição da despesa"
                  required
                />
              </div>
              {errors.description && (
                <p className="help is-danger">{errors.description}</p>
              )}
            </div>

            <div className="field">
              <label className="label">Valor (R$)</label>
              <div className="control">
                <input
                  className={`input ${errors.value ? "is-danger" : ""}`}
                  type="text"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  placeholder="Valor da despesa"
                  required
                />
              </div>
              {errors.value && <p className="help is-danger">{errors.value}</p>}
            </div>

            <div className="field">
              <label className="label">Data da Despesa</label>
              <div className="control">
                <input
                  className={`input ${errors.expense_date ? "is-danger" : ""}`}
                  type="date"
                  name="expense_date"
                  value={formData.expense_date}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.expense_date && (
                <p className="help is-danger">{errors.expense_date}</p>
              )}
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

      {apiErrorMessage && (
        <ErrorModal message={apiErrorMessage} onClose={closeErrorModal} />
      )}
    </div>
  );
};

export default MiscExpensesModal;
