import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Select, MenuItem, InputLabel, FormControl,
  Typography, IconButton, Box, Card, CardContent,
  Snackbar, Alert
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const GET_DATA = gql`
  query {
    allUtilisateurs {
      id
      username
      role
    }
    allProduits {
      id
      nom
      prix
      stock
    }
    allCommandes {
      id
      date
      total
      vendeur {
        id
        username
      }
      lignes {
        id
        quantite
        produit {
          id
          nom
          prix
        }
      }
    }
  }
`;

const CREATE_COMMANDE = gql`
  mutation CreateCommande($vendeurId: ID!, $lignes: [LigneCommandeInput!]!) {
    createCommande(vendeurId: $vendeurId, lignes: $lignes) {
      commande {
        id
        total
        date
        vendeur {
          username
        }
        lignes {
          quantite
          produit {
            nom
            prix
          }
        }
      }
    }
  }
`;

function Commandes() {
  const { loading, error, data, refetch } = useQuery(GET_DATA);
  const [createCommande, { loading: loadingCreate }] = useMutation(CREATE_COMMANDE);

  const [open, setOpen] = useState(false);
  const [selectedVendeur, setSelectedVendeur] = useState('');
  const [lignesCommande, setLignesCommande] = useState([{ produitId: '', quantite: 1 }]);
  const [successMessage, setSuccessMessage] = useState('');

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  const vendeurs = data.allUtilisateurs.filter(u => u.role === 'vendeur');
  const produits = data.allProduits;
  const commandes = data.allCommandes;

  const handleLigneChange = (index, field, value) => {
    const newLignes = [...lignesCommande];
    newLignes[index][field] = value;
    setLignesCommande(newLignes);
  };

  const addLigne = () => {
    setLignesCommande([...lignesCommande, { produitId: '', quantite: 1 }]);
  };

  const removeLigne = (index) => {
    const newLignes = lignesCommande.filter((_, i) => i !== index);
    setLignesCommande(newLignes);
  };

  const handleSubmit = async () => {
    try {
      await createCommande({
        variables: {
          vendeurId: selectedVendeur,
          lignes: lignesCommande.map(l => ({
            produitId: l.produitId,
            quantite: parseInt(l.quantite)
          }))
        }
      });
      setOpen(false);
      setSelectedVendeur('');
      setLignesCommande([{ produitId: '', quantite: 1 }]);
      refetch();
      setSuccessMessage('✅ Commande créée avec succès !');
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  return (
    <Box sx={{ padding: 4, color: 'white' }}>
      <Typography variant="h4" gutterBottom>💼 Gestion des Commandes</Typography>

      <Button variant="contained" color="secondary" onClick={() => setOpen(true)} startIcon={<Add />}>
        Créer une commande
      </Button>

      {/* MODAL */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>📝 Nouvelle Commande</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Vendeur</InputLabel>
            <Select value={selectedVendeur} onChange={e => setSelectedVendeur(e.target.value)} required>
              <MenuItem value="">-- Choisir --</MenuItem>
              {vendeurs.map(v => (
                <MenuItem key={v.id} value={v.id}>{v.username}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {lignesCommande.map((ligne, idx) => (
            <Box key={idx} display="flex" alignItems="center" gap={2} mt={2}>
              <FormControl fullWidth>
                <InputLabel>Produit</InputLabel>
                <Select
                  value={ligne.produitId}
                  onChange={e => handleLigneChange(idx, 'produitId', e.target.value)}
                >
                  <MenuItem value="">-- Produit --</MenuItem>
                  {produits.map(p => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.nom} (Prix: {p.prix.toLocaleString()} Ar)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                type="number"
                label="Quantité"
                value={ligne.quantite}
                onChange={e => handleLigneChange(idx, 'quantite', e.target.value)}
                InputProps={{ inputProps: { min: 1 } }}
                sx={{ width: 120 }}
              />
              {lignesCommande.length > 1 && (
                <IconButton color="error" onClick={() => removeLigne(idx)}>
                  <Delete />
                </IconButton>
              )}
            </Box>
          ))}

          <Box mt={2}>
            <Button variant="outlined" onClick={addLigne}>Ajouter un produit</Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loadingCreate}>
            {loadingCreate ? 'Création...' : 'Valider'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Historique */}
      <Box mt={4}>
        <Typography variant="h5">📋 Historique des commandes</Typography>
        {commandes.map(c => (
          <Card key={c.id} sx={{ my: 2, backgroundColor: '#2c3e50', color: 'white' }}>
            <CardContent>
              <Typography variant="subtitle1">
                Commande #{c.id} - {new Date(c.date).toLocaleString()}
              </Typography>
              <Typography variant="body2">Vendeur : {c.vendeur.username}</Typography>
              <Typography variant="body2">
                Total : {c.total.toLocaleString()} Ar
              </Typography>
              <ul>
                {c.lignes.map(l => (
                  <li key={l.id}>
                    {l.produit.nom} x {l.quantite} (Prix: {l.produit.prix.toLocaleString()} Ar)
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Snackbar Message */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Commandes;
