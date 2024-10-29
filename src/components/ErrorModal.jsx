import React from 'react';

const ErrorModal = ({ message, onClose }) => {
  return (
    <div className={`modal ${message ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">
        <div className="box">
          <h2 className="title has-text-danger">Erro</h2>
          <p>{message}</p>
          <button className="button is-danger mt-4" onClick={onClose}>
            Sair
          </button>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
    </div>
  );
};

export default ErrorModal;
