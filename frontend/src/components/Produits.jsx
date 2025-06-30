import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import ProductFormModal from './ProductFormModal';
import ProductCard from './ProductCard';
import { FaCheckCircle } from 'react-icons/fa';

const GET_PRODUCTS = gql`
  query {
    allProduits {
      id
      nom
      prix
      stock
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation($nom: String!, $prix: Float!, $stock: Int!, $vendeurId: Int!) {
    createProduit(nom: $nom, prix: $prix, stock: $stock, vendeurId: $vendeurId) {
      produit {
        id
        nom
        prix
        stock
      }
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation($id: ID!, $nom: String, $prix: Float, $stock: Int) {
    updateProduit(id: $id, nom: $nom, prix: $prix, stock: $stock) {
      produit {
        id
        nom
        prix
        stock
      }
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation($id: ID!) {
    deleteProduit(id: $id) {
      ok
    }
  }
`;

function Produits() {
  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS);
  const [createProduit] = useMutation(CREATE_PRODUCT);
  const [updateProduit] = useMutation(UPDATE_PRODUCT);
  const [deleteProduit] = useMutation(DELETE_PRODUCT);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [vendeurId] = useState(parseInt(localStorage.getItem('user_id')) || 1);
  const [message, setMessage] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (produit) => {
    setEditData(produit);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setConfirmDelete(id);
  };

  const confirmDeleteYes = async () => {
    await deleteProduit({ variables: { id: confirmDelete } });
    setConfirmDelete(null);
    setMessage('Supprimé avec succès');
    refetch();
  };

  const handleSubmit = async (formData) => {
    try {
      if (editData) {
        await updateProduit({ variables: { id: editData.id, ...formData } });
        setMessage('Modifié avec succès');
      } else {
        await createProduit({ variables: { ...formData, vendeurId } });
        setMessage('Ajouté avec succès');
      }
      refetch();
      setModalOpen(false);
    } catch (err) {
      alert("Erreur lors de l'opération : " + err.message);
    }
  };

  if (loading) return <p style={styles.loading}>Chargement...</p>;
  if (error) return <p style={styles.error}>Erreur: {error.message}</p>;

  
  const filteredProduits = data.allProduits.filter(p =>
    p.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Gestion des Produits</h2>
      <button style={styles.addButton} onClick={handleAdd}>+ Ajouter Produit</button>

    
      <input
        type="text"
        placeholder="🔍 Rechercher un produit..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

     
      {message && (
        <div style={styles.message}>
          <FaCheckCircle size={16} /> {message}
        </div>
      )}

     
      <div style={styles.productList}>
        {filteredProduits.map(p => (
          <ProductCard
            key={p.id}
            produit={p}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

     
      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
      />

      
      {confirmDelete && (
        <div style={styles.backdrop}>
          <div style={styles.confirmBox}>
            <p style={{ fontWeight: 'bold' }}>Voulez-vous vraiment supprimer ?</p>
            <div style={{ marginTop: 20, display: 'flex', gap: 20 }}>
              <button style={styles.deleteBtn} onClick={confirmDeleteYes}>Oui</button>
              <button onClick={() => setConfirmDelete(null)}>Non</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#222',
  },
  title: {
    fontSize: '2.4rem',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: '700',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    letterSpacing: '1.2px',
    textShadow: '1px 1px 4px rgba(0,0,0,0.7)',
  },
  addButton: {
    backgroundColor: '#2c5364',
    color: 'white',
    padding: '10px 25px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    marginBottom: '20px',
    display: 'block',
    marginLeft: 'auto',
  },
  searchInput: {
    width: '100%',
    padding: '10px 15px',
    marginBottom: '20px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outline: 'none',
  },
  productList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))',
    gap: '20px',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    marginTop: '50px',
  },
  error: {
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
    marginTop: '50px',
  },
  message: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#dff0d8',
    color: '#3c763d',
    padding: '10px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '1rem',
    fontWeight: '500',
    border: '1px solid #d6e9c6',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
    animation: 'fadeMoveInOut 6s ease forwards',
  },
  backdrop: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  confirmBox: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    textAlign: 'center',
    color: '#333',
    width: '300px',
  },
  deleteBtn: {
    backgroundColor: '#c0392b',
    color: '#fff',
    padding: '8px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  }
};

export default Produits;
