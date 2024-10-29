import React from 'react';

const ConfirmModal = ({ isActive, message, onConfirm, onCancel }) => {
  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onCancel}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Confirmação</p>
          <button className="delete" aria-label="close" onClick={onCancel}></button>
        </header>
        <section className="modal-card-body">
          <p>{message}</p>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-danger mr-3" onClick={onConfirm}>Excluir</button>
          <button className="button" onClick={onCancel}>Cancelar</button>
        </footer>
      </div>
    </div>
  );
};

export default ConfirmModal;
