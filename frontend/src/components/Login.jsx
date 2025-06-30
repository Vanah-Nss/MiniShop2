import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import { FaMoon, FaSun, FaShopify } from 'react-icons/fa';
import { Fade } from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';

const TOKEN_AUTH = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tokenAuth, { loading }] = useMutation(TOKEN_AUTH);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);

  const navigate = useNavigate();

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!captchaValue) {
      setErrorMsg('✅ Veuillez valider le reCAPTCHA.');
      return;
    }

    tokenAuth({ variables: { username, password } })
      .then(response => {
        localStorage.setItem('token', response.data.tokenAuth.token);
        setSuccess('✅ Connexion réussie !');
        setErrorMsg('');
        setTimeout(() => navigate('/dashboard'), 1000);
      })
      .catch(() => {
        setErrorMsg("❌ Identifiants incorrects.");
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
            ? 'linear-gradient(to bottom right, #2c3e50, #34495e)'
            : 'linear-gradient(to bottom right, #1e3799, #2980b9)' 
        }}>
          <div style={styles.logo}>
            <FaShopify size={40} />
            <h1>MiniShop</h1>
          </div>
          <p style={styles.subtitle}>Trouvez les meilleurs produits et gérez vos ventes avec style.</p>
        </div>

        
        <Fade in timeout={800}>
          <div style={{
            ...styles.right,
            backgroundColor: darkMode ? '#2f3542' : '#fff',
            color: darkMode ? '#fff' : '#333'
          }}>
            <h2 style={styles.compte}>CONNEXION</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <label style={styles.label}>Nom de l'utiisateur</label>
              <input
                type="text"
                placeholder="ex: johndoe"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={styles.input}
                required
              />

              <label style={styles.label}>Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={styles.input}
                required
              />

              {/* reCAPTCHA */}
              <div style={{ marginTop: 10 }}>
                <ReCAPTCHA
                  sitekey="6LdzhW8rAAAAAFN7fEFRZfM5r7bww9a-pBBzTKmf"
                  onChange={handleCaptchaChange}
                />
              </div>

            
              {errorMsg && <p style={styles.error}>{errorMsg}</p>}
              {success && <p style={styles.success}>{success}</p>}

              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <p style={styles.footerText}>
              Pas de compte ? <Link to="/register" style={styles.link}>Inscrivez-vous</Link>
            </p>
          </div>
        </Fade>
      </div>
    </div>
  );
}


const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    fontFamily: "'Segoe UI', sans-serif"
  },
  toggle: {
    position: 'absolute',
    top: 20,
    right: 30
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.5rem'
  },
  card: {
    width: '860px',
    height: '500px',
    display: 'flex',
    boxShadow: '0 0 20px rgba(0,0,0,0.2)',
    borderRadius: '15px',
    overflow: 'hidden'
  },
  left: {
    flex: 1,
    padding: '50px 30px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: '#fff'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '2rem',
    fontWeight: 'bold'
  },
  subtitle: {
    marginTop: '20px',
    fontSize: '1rem',
    maxWidth: '280px',
    lineHeight: '1.5'
  },
  right: {
    flex: 1,
    padding: '50px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  compte: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '25px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  label: {
    fontWeight: 'bold'
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outline: 'none'
  },
  button: {
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#2980b9',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  error: {
    color: 'red',
    fontSize: '0.9rem'
  },
  success: {
    color: 'green',
    fontSize: '0.9rem'
  },
  footerText: {
    marginTop: '20px',
    fontSize: '0.95rem'
  },
  link: {
    color: '#e74c3c',
    fontWeight: 'bold',
    textDecoration: 'none'
  }
};

export default Login;
