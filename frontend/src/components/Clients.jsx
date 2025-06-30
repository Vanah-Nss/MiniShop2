import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_CLIENTS,
  CREATE_CLIENT,
  UPDATE_CLIENT,
  DELETE_CLIENT,
} from "../graphql/clientQueries";

import ClientFormModal from "./ClientFormModal";
import { FaPlus, FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";

export default function Clients() {
  const { loading, error, data, refetch } = useQuery(GET_CLIENTS);
  const [createClient] = useMutation(CREATE_CLIENT);
  const [updateClient] = useMutation(UPDATE_CLIENT);
  const [deleteClient] = useMutation(DELETE_CLIENT);

  const [modalOpen, setModalOpen] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleAdd = () => {
    setEditClient(null);
    setModalOpen(true);
  };

  const handleSubmit = async (form) => {
    try {
      if (editClient) {
        await updateClient({ variables: { id: editClient.id, ...form } });
        setMessage("Client modifié avec succès !");
      } else {
        await createClient({ variables: form });
        setMessage("Client ajouté avec succès !");
      }
      refetch();
      setModalOpen(false);
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  const handleDelete = async (id) => {
    setConfirmDelete(id);
  };

  const confirmDeleteYes = async () => {
    await deleteClient({ variables: { id: confirmDelete } });
    refetch();
    setConfirmDelete(null);
    setMessage("Client supprimé !");
  };

  if (loading) return <p style={styles.loading}>Chargement...</p>;
  if (error) return <p style={styles.error}>Erreur : {error.message}</p>;

  const filteredClients = data.allClients.filter(c =>
    c.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Gestion des Clients</h2>
      <button style={styles.addButton} onClick={handleAdd}>
        <FaPlus style={{ marginRight: 6 }} />
        Ajouter Client
      </button>

      <input
        type="text"
        placeholder="🔍 Rechercher un client..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

      {message && (
        <div style={styles.message}>
          <FaCheckCircle size={16} /> {message}
        </div>
      )}

      <div style={styles.grid}>
        {filteredClients.map((client) => (
          <div key={client.id} style={styles.card}>
            <h3 style={styles.cardTitle}>👤 {client.nom}</h3>
            <p style={styles.text}>📧 {client.email}</p>
            <p style={styles.text}>📞 {client.telephone}</p>
            <p style={styles.text}>🏠 {client.adresse}</p>
            <div style={styles.actions}>
              <button onClick={() => { setEditClient(client); setModalOpen(true); }} style={styles.iconBtn}>
                <FaEdit size={18} color="green" />
              </button>
              <button onClick={() => handleDelete(client.id)} style={styles.iconBtn}>
                <FaTrash size={16} color="#c0392b" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ClientFormModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editClient}
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
    display: 'flex',
    alignItems: 'center',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  text: {
    marginBottom: '5px',
    fontSize: '0.95rem',
  },
  actions: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
  },
  iconBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
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
  },
};
