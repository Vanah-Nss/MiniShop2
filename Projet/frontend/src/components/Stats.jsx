import React from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  Box, Typography, Grid, Card, CardContent, CircularProgress, Fade
} from '@mui/material';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FaUsers, FaClock, FaStar } from 'react-icons/fa';

const STATS_QUERY = gql`
  query {
    dashboardStats {
      totalCommandes
      totalVentes
      totalClients
      produitLePlusVendu
      derniereCommande
      topProduits {
        nom
        quantite
      }
    }
  }
`;

const COLORS = ['#e74c3c', '#9b59b6', '#f39c12', '#27ae60', '#2980b9'];

export default function Stats() {
  const { loading, error, data } = useQuery(STATS_QUERY);

  if (loading) return <Box sx={{ textAlign: 'center', mt: 10 }}><CircularProgress sx={{ color: '#1abc9c' }} /></Box>;
  if (error) return <Typography color="error">Erreur : {error.message}</Typography>;

  const {
    totalCommandes,
    totalVentes,
    totalClients,
    produitLePlusVendu,
    derniereCommande,
    topProduits,
  } = data.dashboardStats;

  return (
    <Fade in timeout={600}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#fff' }}>
          📈 Statistiques Générales
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={cardStyle('#8e44ad')}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FaUsers size={28} />
                  <Typography variant="h6">Clients</Typography>
                </Box>
                <Typography variant="h3" sx={valueStyle}>{totalClients}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={cardStyle('#f39c12')}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FaStar size={28} />
                  <Typography variant="h6">Produit #1</Typography>
                </Box>
                <Typography variant="h5" sx={valueStyle}>{produitLePlusVendu || 'Aucun'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={cardStyle('#34495e')}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FaClock size={28} />
                  <Typography variant="h6">Dernière commande</Typography>
                </Box>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {new Date(derniereCommande).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Graphique des top produits */}
          <Grid item xs={12}>
            <Card sx={cardStyle('#2c3e50')}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FaStar /> Top 5 Produits les plus vendus
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topProduits}
                      dataKey="quantite"
                      nameKey="nom"
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {topProduits.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'Quantité']} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
}

const cardStyle = (bgColor) => ({
  backgroundColor: bgColor,
  color: '#fff',
  borderRadius: '24px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
  }
});

const valueStyle = {
  fontWeight: 'bold',
  fontSize: '2.8rem',
  mt: 2
};
