import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import DonationModal from "./DonationModal";
import ConfirmModal from "./ConfirmModal"; // Importa o ConfirmModal
import ErrorModal from "./ErrorModal";
import api from "../api";

const CashDonations = () => {
  const [isModalActive, setModalActive] = useState(false);
  const [isConfirmModalActive, setConfirmModalActive] = useState(false); // Estado para o ConfirmModal
  const [editOrCreate, setEditOrCreate] = useState("create");
  const [donationId, setDonationId] = useState(null);
  const [donationToDelete, setDonationToDelete] = useState(null); // Armazena o ID para exclusão
  const [formData, setFormData] = useState({
    donor_name: "",
    quantity: 0,
    donation_date: "",
  });
  const [donations, setDonations] = useState([]);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  const [token] = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Doações Recebidas";
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const fetchDonations = async () => {
    try {
      const response = await api.get("/donations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDonations(response.data);
    } catch (error) {
      console.error("Erro ao buscar as doações:", error);
      setApiErrorMessage(
        error.response?.data?.detail || "Erro ao buscar as doações."
      );
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [token]);

  const openModalForCreate = () => {
    setEditOrCreate("create");
    setFormData({
      donor_name: "",
      quantity: 0,
      donation_date: "",
    });
    setModalActive(true);
  };

  const openModalForEdit = (id, data) => {
    setEditOrCreate("edit");
    setDonationId(id);
    setFormData({
      donor_name: data.donor_name,
      quantity: data.quantity,
      donation_date: data.donation_date,
    });
    setModalActive(true);
  };

  const closeModal = () => {
    setModalActive(false);
  };

  const openConfirmModal = (id) => {
    setDonationToDelete(id);
    setConfirmModalActive(true);
  };

  const closeConfirmModal = () => {
    setDonationToDelete(null);
    setConfirmModalActive(false);
  };

  const handleDelete = async () => {
    if (!donationToDelete) return;

    try {
      await api.delete(`/donations/${donationToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Doação excluída com sucesso!");
      fetchDonations();
    } catch (error) {
      console.error("Erro ao excluir a doação:", error);
      setApiErrorMessage(
        error.response?.data?.detail || "Erro ao excluir a doação."
      );
    } finally {
      closeConfirmModal();
    }
  };

  const handleSave = async () => {
    setModalActive(false);
    fetchDonations();
  };

  const closeErrorModal = () => {
    setApiErrorMessage("");
  };

  return (
    <div
      className="box"
      style={{ width: "80%", margin: "0 auto", padding: "2rem" }}
    >
      <h1 className="title has-text-centered">Doações Recebidas</h1>

      {/* Tabela de doações */}
      <table className="table is-bordered is-fullwidth mt-4">
        <thead>
          <tr>
            <th>Doador</th>
            <th>Quantidade em Kg</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {donations.length > 0 ? (
            donations.map((donation) => (
              <tr key={donation.id}>
                <td>{donation.donor_name}</td>
                <td>
                  {parseFloat(donation.quantity).toFixed(2).replace(".", ",")}
                </td>
                <td>{donation.donation_date.split("-").reverse().join("/")}</td>
                <td>
                  <button
                    className="button is-small is-warning mr-2"
                    onClick={() => openModalForEdit(donation.id, donation)}
                  >
                    Editar
                  </button>
                  <button
                    className="button is-small is-danger"
                    onClick={() => openConfirmModal(donation.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="has-text-centered">
                Nenhuma doação encontrada
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="has-text-right">
        <button className="button is-success mt-4" onClick={openModalForCreate}>
          Adicionar doação
        </button>
      </div>

      {/* Modal de doação */}
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

      {/* Modal de confirmação para exclusão */}
      <ConfirmModal
        isActive={isConfirmModalActive}
        message="Tem certeza que deseja excluir esta doação?"
        onConfirm={handleDelete}
        onCancel={closeConfirmModal}
      />

      {/* Error Modal */}
      {apiErrorMessage && (
        <ErrorModal message={apiErrorMessage} onClose={closeErrorModal} />
      )}
    </div>
  );
};

export default CashDonations;
