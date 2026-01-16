import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/themes')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Données reçues:', data); // Pour déboguer
        setThemes(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur fetch:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Chargement des compétences depuis l'API...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '40px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#e74c3c' }}>❌ Erreur de connexion</h2>
        <p>{error}</p>
        <p>Vérifie que le backend tourne sur http://localhost:3000</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Calcul des statistiques
  const totalThemes = themes.length;
  const totalSkills = themes.reduce((sum, theme) => sum + (theme.skills?.length || 0), 0);
  const acquiredSkills = themes.reduce((sum, theme) => 
    sum + (theme.skills?.filter(skill => skill.status === 'acquired').length || 0), 0);
  const overallProgress = totalSkills > 0 ? Math.round((acquiredSkills / totalSkills) * 100) : 0;

  return (
    <div style={{ 
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#2c3e50', fontSize: '2.5rem' }}>📊 Dashboard des Compétences</h1>
        <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>
          Données récupérées depuis l'API backend (Neon PostgreSQL)
        </p>
      </header>

      {/* Statistiques */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>{totalThemes}</div>
          <div style={{ color: '#7f8c8d' }}>Thèmes</div>
        </div>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2ecc71' }}>{totalSkills}</div>
          <div style={{ color: '#7f8c8d' }}>Compétences totales</div>
        </div>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>{acquiredSkills}</div>
          <div style={{ color: '#7f8c8d' }}>Compétences acquises</div>
        </div>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9b59b6' }}>{overallProgress}%</div>
          <div style={{ color: '#7f8c8d' }}>Progression globale</div>
        </div>
      </div>

      {/* Liste des thèmes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {themes.map(theme => {
          const themeSkills = theme.skills?.length || 0;
          const themeAcquired = theme.skills?.filter(s => s.status === 'acquired').length || 0;
          const themeProgress = themeSkills > 0 ? Math.round((themeAcquired / themeSkills) * 100) : 0;

          return (
            <div key={theme.id} style={{
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              padding: '25px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{ margin: 0, color: '#2c3e50' }}>{theme.name}</h2>
                <span style={{
                  background: '#3498db',
                  color: 'white',
                  padding: '5px 15px',
                  borderRadius: '20px',
                  fontSize: '0.9rem'
                }}>
                  {themeSkills} compétence{themeSkills > 1 ? 's' : ''}
                </span>
              </div>

              {/* Barre de progression */}
              <div style={{ marginBottom: '25px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{ color: '#555' }}>Progression du thème</span>
                  <strong style={{ fontSize: '1.1rem' }}>{themeProgress}%</strong>
                </div>
                <div style={{
                  height: '12px',
                  background: '#ecf0f1',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #2ecc71, #3498db)',
                    width: `${themeProgress}%`,
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>

              {/* Compétences */}
              <div>
                <h3 style={{ color: '#555', marginBottom: '15px' }}>Compétences</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {theme.skills?.map(skill => (
                    <div key={skill.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 15px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef'
                    }}>
                      <span style={{ fontWeight: '500' }}>{skill.name}</span>
                      <span style={{
                        padding: '5px 12px',
                        borderRadius: '15px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        background: skill.status === 'acquired' ? '#d4edda' : 
                                   skill.status === 'in-progress' ? '#fff3cd' : '#f8d7da',
                        color: skill.status === 'acquired' ? '#155724' : 
                               skill.status === 'in-progress' ? '#856404' : '#721c24'
                      }}>
                        {skill.status === 'acquired' ? '✅ Acquis' : 
                         skill.status === 'in-progress' ? '🔄 En cours' : '❌ Non commencé'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <footer style={{
        textAlign: 'center',
        marginTop: '50px',
        padding: '20px',
        color: '#7f8c8d',
        borderTop: '1px solid #eee'
      }}>
        <p>Dashboard React - Projet ADA Tech School</p>
        <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>
          Backend Express sur http://localhost:3000 | Base de données Neon PostgreSQL
        </p>
      </footer>
    </div>
  );
}

export default App; 