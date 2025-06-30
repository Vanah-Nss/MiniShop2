import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_DATA } from '../graphql/queries';
import {
  Box, Typography, Grid, Card, CardContent, CircularProgress, Fade
} from '@mui/material';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FaShoppingCart, FaMoneyBillWave, FaChartPie } from 'react-icons/fa';

const COLORS = ['#3498db', '#2ecc71', '#f1c40f', '#e67e22', '#9b59b6'];

function TableauDeBord() {
  const { loading, error, data } = useQuery(GET_DASHBOARD_DATA);

  if (loading) return <Box sx={{ textAlign: 'center', mt: 10 }}><CircularProgress sx={{ color: '#1abc9c' }} /></Box>;
  if (error) return <Typography color="error">Erreur: {error.message}</Typography>;

  const commandes = data.allCommandes;
  const totalCommandes = commandes.length;
  const totalVentes = commandes.reduce((acc, c) => acc + c.total, 0);

  
  const produitStats = {};
  commandes.forEach(c => {
    c.lignes.forEach(l => {
      const nom = l.produit.nom;
      if (!produitStats[nom]) produitStats[nom] = 0;
      produitStats[nom] += l.quantite;
    });
  });

  const topProduits = Object.entries(produitStats)
    .map(([nom, quantite]) => ({ nom, quantite }))
    .sort((a, b) => b.quantite - a.quantite)
    .slice(0, 5);

  return (
    <Fade in timeout={600}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#ffffff' }}>
          📊 Tableau de bord
        </Typography>

        <Grid container spacing={4}>
         
          <Grid item xs={12} md={4}>
            <Card sx={cardStyle('#34495e')}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FaShoppingCart size={30} />
                  <Typography variant="h6">Commandes</Typography>
                </Box>
                <Typography variant="h3" sx={valueStyle}>
                  {totalCommandes}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          
          <Grid item xs={12} md={4}>
            <Card sx={cardStyle('#1abc9c')}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FaMoneyBillWave size={30} />
                  <Typography variant="h6">Chiffre d'affaires</Typography>
                </Box>
                <Typography variant="h3" sx={valueStyle}>
                  {totalVentes.toLocaleString()} Ar
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        
          <Grid item xs={12}>
            <Card sx={cardStyle('#2c3e50')}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FaChartPie size={28} />
                  <Typography variant="h6">Top 5 Produits les plus commandés</Typography>
                </Box>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topProduits}
                      dataKey="quantite"
                      nameKey="nom"
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      fill="#8884d8"
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

export default TableauDeBord;
