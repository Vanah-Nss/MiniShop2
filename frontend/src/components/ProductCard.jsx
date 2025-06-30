import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

function ProductCard({ produit, onEdit, onDelete }) {
  return (
    <div style={cardStyle}>
      <p style={text}><strong>Nom du produit :</strong> {produit.nom}</p>
      <p style={text}><strong>Prix :</strong> {produit.prix} Ar</p>
      <p style={text}><strong>Stock :</strong> {produit.stock}</p>

      <div style={actionStyle}>
        <button
          style={iconButton}
          onClick={() => onEdit(produit)}
          aria-label="Modifier"
        >
          <FaEdit color="green" size={20} />
        </button>
        <button
          style={iconButton}
          onClick={() => onDelete(produit.id)}
          aria-label="Supprimer"
        >
          <FaTrash color="#c0392b" size={18} />
        </button>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: '#fff',
  color: '#333',
  borderRadius: '10px',
  padding: '20px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  minWidth: '220px',
  maxWidth: '300px',
  margin: '10px',
};

const text = {
  fontSize: '1rem',
  marginBottom: '10px',
};

const actionStyle = {
  marginTop: '15px',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '15px',
};

const iconButton = {
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
};

export default ProductCard;
