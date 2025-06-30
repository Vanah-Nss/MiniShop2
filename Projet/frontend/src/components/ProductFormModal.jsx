import React, { useState, useEffect } from 'react';

function ProductFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    if (initialData) {
      setNom(initialData.nom || '');
      setPrix(initialData.prix || '');
      setStock(initialData.stock || '');
    } else {
      setNom('');
      setPrix('');
      setStock('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nom, prix: parseFloat(prix), stock: parseInt(stock) });
    setNom('');
    setPrix('');
    setStock('');
  };

  if (!isOpen) return null;

  const saveButtonStyle = {
    ...buttonStyle,
    backgroundColor: initialData ? '#28a745' : '#2c3e50', // vert si modification, bleu sinon
  };

  return (
    <div style={backdropStyle}>
      <div style={boxStyle}>
        <h3 style={{ marginBottom: '20px' }}>
          {initialData ? 'Modifier un Produit' : 'Ajouter un Produit'}
        </h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <label style={labelStyle}>Nom du produit :</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom du produit"
            required
            style={inputStyle}
          />

          <label style={labelStyle}>Prix :</label>
          <input
            type="number"
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            placeholder="Prix"
            required
            style={inputStyle}
          />

          <label style={labelStyle}>Stock :</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Stock"
            required
            style={inputStyle}
          />

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

const backdropStyle = {
  position: 'fixed',
  top: 0, left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const boxStyle = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '30px',
  width: '400px',
  boxShadow: '0 0 15px rgba(0,0,0,0.3)',
  color: '#333',
};

const labelStyle = {
  fontWeight: '600',
  fontSize: '1rem',
  marginBottom: '5px',
  color: '#444',
};

const inputStyle = {
  padding: '10px',
  fontSize: '1rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#2c3e50',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

export default ProductFormModal;
