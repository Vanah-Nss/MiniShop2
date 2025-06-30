import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaSun, FaMoon, FaShopify } from 'react-icons/fa';
import { Fade } from '@mui/material';

const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $password: String!, $email: String, $role: String!) {
    registerUser(username: $username, password: $password, email: $email, role: $role) {
      utilisateur {
        id
        username
        role
      }
    }
  }
`;

function Register() {
  const [form, setForm] = useState({ username: '', password: '', email: '', role: 'vendeur' });
  const [registerUser, { loading }] = useMutation(REGISTER_USER);
  const [success, setSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser({ variables: form })
      .then(() => {
        setSuccess("✅ Inscription réussie ! Redirection vers la connexion...");
        setErrorMsg('');
        setTimeout(() => navigate('/login'), 2000);
      })
      .catch(err => {
        console.error(err);
        setErrorMsg("❌ Une erreur s'est produite lors de l'inscription.");
        setSuccess('');
      });
  };

  return (
    <div style={{ ...styles.container, backgroundColor: darkMode ? '#1e1e1e' : '#f5f6fa' }}>
      <div style={styles.toggle}>
        <button onClick={() => setDarkMode(!darkMode)} style={styles.toggleBtn}>
          {darkMode ? <FaSun color="#f1c40f" /> : <FaMoon color="#34495e" />}
        </button>
      </div>

      <div style={styles.card}>
        <div style={{
          ...styles.left,
          background: darkMode
            ? 'linear-gradient(to bottom right, #1e3799, #4a69bd)'
            : 'linear-gradient(to bottom right, #1e3799, #4a69bd)'
        }}>
          <div style={styles.logo}><FaShopify size={40} /><h1>MiniShop</h1></div>
          <p style={styles.subtitle}>Créez votre compte et commencez à vendre avec style.</p>
        </div>

        <Fade in timeout={800}>
          <div style={{ ...styles.right, backgroundColor: darkMode ? '#2f3542' : '#fff', color: darkMode ? '#fff' : '#333' }}>
            <h2 style={styles.title}>📝 Inscription</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <FaUser style={styles.icon} />
                <input name="username" type="text" placeholder="Nom d'utilisateur" value={form.username} onChange={handleChange} style={styles.input} required />
              </div>
              <div style={styles.inputGroup}>
                <FaEnvelope style={styles.icon} />
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <FaLock style={styles.icon} />
                <input name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} style={styles.input} required />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold' }}>Rôle :</label>
                <select name="role" value={form.role} onChange={handleChange} style={{ ...styles.input, border: '1px solid #ccc', borderRadius: 5 }} required>
                  <option value="vendeur">Commerçant</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" style={{ ...styles.button, backgroundColor: '#1e3799' }} disabled={loading}>
                {loading ? 'Inscription...' : "S'inscrire"}
              </button>
              {success && <p style={styles.success}>{success}</p>}
              {errorMsg && <p style={styles.error}>{errorMsg}</p>}
            </form>
            <p style={styles.footerText}>
              Déjà inscrit ? <Link to="/login" style={styles.link}>Connectez-vous</Link>
            </p>
          </div>
        </Fade>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontFamily: "'Segoe UI', sans-serif"
  },
  toggle: {
    position: 'absolute', top: 20, right: 30
  },
  toggleBtn: {
    background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem'
  },
  card: {
    width: '860px', height: '500px', display: 'flex', boxShadow: '0 0 20px rgba(0,0,0,0.2)', borderRadius: '15px', overflow: 'hidden'
  },
  left: {
    flex: 1, padding: '50px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff'
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '10px', fontSize: '2rem', fontWeight: 'bold'
  },
  subtitle: {
    marginTop: '20px', fontSize: '1rem', maxWidth: '280px', lineHeight: '1.5'
  },
  right: {
    flex: 1, padding: '50px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center'
  },
  title: {
    fontSize: '2rem', fontWeight: 'bold', marginBottom: '25px'
  },
  form: {
    display: 'flex', flexDirection: 'column', gap: '15px'
  },
  inputGroup: {
    display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '5px', overflow: 'hidden'
  },
  icon: {
    padding: '10px', backgroundColor: '#f0f0f0', borderRight: '1px solid #ccc'
  },
  input: {
    flex: 1, padding: '10px', border: 'none', outline: 'none', fontSize: '1rem'
  },
  button: {
    width: '100%', padding: '12px', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer'
  },
  error: {
    color: 'red', fontSize: '0.9rem'
  },
  success: {
    color: 'green', fontSize: '0.9rem'
  },
  footerText: {
    marginTop: '20px', fontSize: '0.95rem'
  },
  link: {
    color: '#1e3799', fontWeight: 'bold', textDecoration: 'none'
  }
};

export default Register;
