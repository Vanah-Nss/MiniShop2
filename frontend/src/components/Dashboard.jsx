import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaSignOutAlt,
  FaStore,
  FaUsers,
  FaChartBar
} from 'react-icons/fa';

function Dashboard({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navigateTo = (path) => {
    navigate(path);
    setActivePath(path);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      <aside style={{
        width: '206px',
        backgroundColor: '#1e2a38',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '1px 25px',
        position: 'fixed',
        height: '100vh',
        boxShadow: '2px 0 8px rgba(0,0,0,0.2)'
      }}>
        <h2 style={{ marginBottom: '40px', fontWeight: 'bold', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaStore /> MiniShop
        </h2>

        <SidebarButton
          icon={<FaTachometerAlt />}
          label="Tableau de Bord"
          onClick={() => navigateTo('/dashboard')}
          active={activePath === '/dashboard'}
        />

        <SidebarButton
          icon={<FaBoxOpen />}
          label="Produits"
          onClick={() => navigateTo('/produits')}
          active={activePath === '/produits'}
        />

        <SidebarButton
          icon={<FaShoppingCart />}
          label="Commandes"
          onClick={() => navigateTo('/commandes')}
          active={activePath === '/commandes'}
        />

        <SidebarButton
          icon={<FaUsers />}
          label="Clients"
          onClick={() => navigateTo('/clients')}
          active={activePath === '/clients'}
        />

        <SidebarButton
          icon={<FaChartBar />}
          label="Statistiques"
          onClick={() => navigateTo('/stats')}
          active={activePath === '/stats'}
        />

        <div style={{ marginTop: 'auto' }}>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            style={{
              backgroundColor: '#c0392b',
              color: '#fff',
              border: 'none',
              width: '100%',
              padding: '10px',
              borderRadius: '95px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '1rem'
            }}
          >
            <FaSignOutAlt /> Déconnexion
          </button>
        </div>
      </aside>

      <main style={{
        marginLeft: '240px',
        flexGrow: 1,
        background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
        color: '#fff',
        padding: '30px',
        minHeight: '100vh'
      }}>
        {children}
      </main>

    
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0,
          width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{ backgroundColor: '#fff', color: '#333', padding: '30px', borderRadius: '10px', textAlign: 'center', width: '320px' }}>
            <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
              Voulez-vous vous déconnecter ?
            </p>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-around' }}>
              <button onClick={handleLogout} style={buttonStyle}>Oui</button>
              <button onClick={() => setShowLogoutConfirm(false)} style={buttonStyle}>Non</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
const SidebarButton = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    style={{
      backgroundColor: active ? '#2980b9' : 'transparent',
      border: 'none',
      color: active ? '#fff' : '#ccc',
      textAlign: 'left',
      padding: '12px 15px',
      marginBottom: '15px',
      fontSize: '1.1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      borderRadius: '8px',
      boxShadow: active ? '0 0 10px #2980b9' : 'none',
      transition: 'all 0.3s ease',
    }}
    onMouseEnter={e => !active && (e.currentTarget.style.backgroundColor = '#34495e')}
    onMouseLeave={e => !active && (e.currentTarget.style.backgroundColor = 'transparent')}
  >
    <span style={{ fontSize: '1.5rem' }}>{icon}</span>
    {label}
    {active && (
      <span style={{
        marginLeft: 'auto',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1.3rem',
        userSelect: 'none',
      }}>✔</span>
    )}
  </button>
);

const buttonStyle = {
  padding: '10px 25px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#2c5364',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default Dashboard;
