import React, { useState, useEffect } from 'react';

function ClientFormModal({ show, onClose, onSubmit, initialData }) {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');

  useEffect(() => {
    if (initialData) {
      setNom(initialData.nom || '');
      setEmail(initialData.email || '');
      setTelephone(initialData.telephone || '');
      setAdresse(initialData.adresse || '');
    } else {
      setNom('');
      setEmail('');
      setTelephone('');
      setAdresse('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nom, email, telephone, adresse });
  };

  if (!show) return null;

  const saveButtonStyle = {
    ...buttonStyle,
    backgroundColor: initialData ? '#28a745' : '#2c3e50', // Vert si modification, bleu sinon
  };

  return (
    <div style={backdropStyle}>
      <div style={boxStyle}>
        <h3 style={titleStyle}>
          {initialData ? 'Modifier un Client' : 'Ajouter un Client'}
        </h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <div>
            <label style={labelStyle}>Nom :</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              placeholder="Nom du client"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Email :</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Téléphone :</label>
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="Téléphone"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Adresse :</label>
            <input
              type="text"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              placeholder="Adresse"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="submit" style={saveButtonStyle}>
              {initialData ? 'Modifier' : 'Enregistrer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ ...buttonStyle, backgroundColor: '#ccc', color: '#000' }}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Styles de luxe

const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

const boxStyle = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '30px',
  width: '400px',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
  color: '#333',
};

const titleStyle = {
  marginBottom: '20px',
  fontSize: '1.4rem',
  fontWeight: 'bold',
  textAlign: 'center',
  color: '#2c3e50',
};

const labelStyle = {
  fontWeight: '600',
  fontSize: '1rem',
  marginBottom: '5px',
  display: 'block',
  color: '#444',
};

const inputStyle = {
  padding: '10px',
  fontSize: '1rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  width: '100%',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#2c3e50',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default ClientFormModal;
