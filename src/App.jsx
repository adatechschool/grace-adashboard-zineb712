import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');
  const [newSkills, setNewSkills] = useState(['']);

  // Phrases par défaut comme sur la capture d'écran
  const defaultSkills = [
    "je sais créer le squelette de base",
    "je sais créer des images",
    "je sais créer des liens"
  ];

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/themes');
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const data = await response.json();
      setThemes(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSkillStatus = async (skillId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/themes/skills/${skillId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        loadThemes();
      } else {
        alert('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion au serveur');
    }
  };

  const deleteTheme = async (themeId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce thème et toutes ses compétences ?')) {
      try {
        const response = await fetch(`http://localhost:3000/themes/${themeId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          loadThemes();
        } else {
          alert(`Erreur: ${response.status}`);
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion');
      }
    }
  };

  const addNewTheme = async () => {
    if (!newThemeName.trim()) {
      alert('Veuillez entrer un nom pour le thème');
      return;
    }

    // Utiliser les phrases par défaut si aucune compétence n'est saisie
    const skillsToAdd = newSkills.filter(skill => skill.trim() !== '');
    const finalSkills = skillsToAdd.length > 0 ? skillsToAdd : defaultSkills;

    try {
      const response = await fetch('http://localhost:3000/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newThemeName,
          skills: finalSkills.map(skillName => ({
            name: skillName,
            status: 'not-started'
          }))
        }),
      });

      if (response.ok) {
        // Réinitialiser le formulaire
        setNewThemeName('');
        setNewSkills(['']);
        setShowAddForm(false);
        
        // Recharger les thèmes
        loadThemes();
        alert('Thème ajouté avec succès !');
      } else {
        alert('Erreur lors de l\'ajout du thème');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion au serveur');
    }
  };

  const addSkillField = () => {
    setNewSkills([...newSkills, '']);
  };

  const removeSkillField = (index) => {
    if (newSkills.length > 1) {
      const updatedSkills = [...newSkills];
      updatedSkills.splice(index, 1);
      setNewSkills(updatedSkills);
    }
  };

  const updateSkillField = (index, value) => {
    const updatedSkills = [...newSkills];
    updatedSkills[index] = value;
    setNewSkills(updatedSkills);
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <h2>Chargement des compétences...</h2>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
        <h2>❌ Erreur</h2>
        <p>{error}</p>
        <button onClick={loadThemes} style={styles.button}>
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
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>📊 Dashboard des Compétences</h1>
        <p style={styles.subtitle}>
          Gestion des compétences techniques - {totalThemes} thèmes, {totalSkills} compétences
        </p>
      </header>

      {/* Bouton pour ajouter un thème */}
      <div style={styles.addButtonContainer}>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={styles.addButton}
        >
          {showAddForm ? '✖ Annuler' : '➕ Ajouter un thème'}
        </button>
      </div>

      {/* Formulaire d'ajout de thème */}
      {showAddForm && (
        <div style={styles.addForm}>
          <h3 style={styles.formTitle}>➕ Nouveau Thème</h3>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nom du thème *</label>
            <input
              type="text"
              value={newThemeName}
              onChange={(e) => setNewThemeName(e.target.value)}
              placeholder="Ex: HTML, CSS, JavaScript..."
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Compétences (laisser vide pour utiliser les phrases par défaut)</label>
            {newSkills.map((skill, index) => (
              <div key={index} style={styles.skillInputRow}>
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateSkillField(index, e.target.value)}
                  placeholder={`Compétence ${index + 1}`}
                  style={styles.skillInput}
                />
                {newSkills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSkillField(index)}
                    style={styles.removeSkillButton}
                  >
                    ✖
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSkillField}
              style={styles.addSkillButton}
            >
              ➕ Ajouter une compétence
            </button>
            <div style={styles.defaultSkillsInfo}>
              <p><strong>Phrases par défaut si vide :</strong></p>
              <ul style={styles.defaultSkillsList}>
                {defaultSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={styles.formActions}>
            <button
              onClick={addNewTheme}
              style={styles.submitButton}
            >
              ✅ Créer le thème
            </button>
          </div>
        </div>
      )}

      {/* Statistiques */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{totalThemes}</div>
          <div style={styles.statLabel}>Thèmes</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{totalSkills}</div>
          <div style={styles.statLabel}>Compétences</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{acquiredSkills}</div>
          <div style={styles.statLabel}>Acquises</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{overallProgress}%</div>
          <div style={styles.statLabel}>Progression</div>
        </div>
      </div>

      {/* Liste des thèmes */}
      <div style={styles.themes}>
        {themes.map(theme => {
          const themeSkills = theme.skills?.length || 0;
          const themeAcquired = theme.skills?.filter(s => s.status === 'acquired').length || 0;
          const themeProgress = themeSkills > 0 ? Math.round((themeAcquired / themeSkills) * 100) : 0;

          return (
            <div key={theme.id} style={styles.themeCard}>
              <div style={styles.themeHeader}>
                <h2 style={styles.themeName}>## {theme.name}</h2>
                <div style={styles.themeHeaderRight}>
                  <span style={styles.countBadge}>
                    {themeSkills} compétence{themeSkills > 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => deleteTheme(theme.id)}
                    style={styles.deleteButton}
                    title="Supprimer ce thème"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>

              {/* Barre de progression */}
              <div style={styles.progressContainer}>
                <div style={styles.progressInfo}>
                  <span>Progression du thème</span>
                  <strong>{themeProgress}%</strong>
                </div>
                <div style={styles.progressBar}>
                  <div style={{...styles.progressFill, width: `${themeProgress}%`}}></div>
                </div>
              </div>

              {/* Compétences */}
              <div style={styles.skillsSection}>
                <h3 style={styles.skillsTitle}>Compétences</h3>
                <div style={styles.skillsList}>
                  {theme.skills?.map(skill => {
                    const getStatusStyle = (status) => {
                      switch (status) {
                        case 'acquired': return { 
                          background: '#d4edda', 
                          color: '#155724', 
                          emoji: '✅',
                          label: 'Acquis'
                        };
                        case 'in-progress': return { 
                          background: '#fff3cd', 
                          color: '#856404', 
                          emoji: '🔄',
                          label: 'En cours'
                        };
                        default: return { 
                          background: '#f8d7da', 
                          color: '#721c24', 
                          emoji: '❌',
                          label: 'Non commencé'
                        };
                      }
                    };

                    const style = getStatusStyle(skill.status);

                    return (
                      <div key={skill.id} style={styles.skillRow}>
                        <span style={styles.skillName}>{skill.name}</span>
                        <div style={styles.skillControls}>
                          <span style={{...styles.statusBadge, background: style.background, color: style.color}}>
                            {style.emoji} {style.label}
                          </span>
                          <select
                            value={skill.status}
                            onChange={(e) => updateSkillStatus(skill.id, e.target.value)}
                            style={styles.select}
                          >
                            <option value="not-started">❌ Non commencé</option>
                            <option value="in-progress">🔄 En cours</option>
                            <option value="acquired">✅ Acquis</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Dashboard React - Backend: http://localhost:3000 | {new Date().getFullYear()}
        </p>
        <button onClick={loadThemes} style={styles.refreshButton}>
          🔄 Actualiser les données
        </button>
      </footer>
    </div>
  );
}

// Styles avec arrière-plan plus pale
const styles = {
  container: {
    padding: '30px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f5f7fa', // Plus pale
    minHeight: '100vh'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '25px',
    background: 'linear-gradient(135deg, #6a89cc 0%, #b8e994 100%)', // Plus doux
    borderRadius: '15px',
    color: 'white',
    boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '2.2rem',
    fontWeight: '600'
  },
  subtitle: {
    margin: '0',
    opacity: '0.9',
    fontSize: '1rem'
  },
  addButtonContainer: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  addButton: {
    padding: '12px 25px',
    background: 'linear-gradient(135deg, #78e08f 0%, #38ada9 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(120, 224, 143, 0.3)'
  },
  addForm: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '30px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    border: '1px solid #e1e8ed'
  },
  formTitle: {
    marginTop: '0',
    color: '#2c3e50',
    borderBottom: '2px solid #78e08f',
    paddingBottom: '10px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e1e8ed',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    transition: 'border 0.3s ease',
    backgroundColor: '#f8f9fa'
  },
  skillInputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px'
  },
  skillInput: {
    flex: '1',
    padding: '10px',
    border: '2px solid #e1e8ed',
    borderRadius: '6px',
    fontSize: '1rem',
    backgroundColor: '#f8f9fa'
  },
  removeSkillButton: {
    padding: '8px 12px',
    background: '#e55039',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  addSkillButton: {
    padding: '8px 15px',
    background: '#4a69bd',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginTop: '10px'
  },
  defaultSkillsInfo: {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px dashed #ddd'
  },
  defaultSkillsList: {
    margin: '10px 0 0 0',
    paddingLeft: '20px',
    color: '#555'
  },
  formActions: {
    textAlign: 'right'
  },
  submitButton: {
    padding: '12px 25px',
    background: 'linear-gradient(135deg, #4a69bd 0%, #6a89cc 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600'
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  statCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    border: '1px solid #e1e8ed'
  },
  statNumber: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '8px'
  },
  statLabel: {
    color: '#7f8c8d',
    fontSize: '0.95rem',
    fontWeight: '500'
  },
  themes: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px'
  },
  themeCard: {
    background: 'white',
    border: '1px solid #e1e8ed',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.04)',
    position: 'relative'
  },
  themeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  themeHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginTop: '5px'
  },
  themeName: {
    margin: '0',
    color: '#2c3e50',
    fontSize: '1.4rem',
    flex: '1',
    minWidth: '200px'
  },
  deleteButton: {
    background: '#e55039',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 15px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  },
  countBadge: {
    background: '#4a69bd',
    color: 'white',
    padding: '6px 15px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '500',
    whiteSpace: 'nowrap'
  },
  progressContainer: {
    marginBottom: '25px'
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    color: '#555'
  },
  progressBar: {
    height: '10px',
    background: '#ecf0f1',
    borderRadius: '5px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #78e08f, #4a69bd)',
    transition: 'width 0.5s ease'
  },
  skillsSection: {
    marginTop: '20px'
  },
  skillsTitle: {
    color: '#555',
    marginBottom: '15px',
    fontSize: '1.2rem'
  },
  skillsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  skillRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 15px',
    background: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    transition: 'all 0.3s ease'
  },
  skillName: {
    fontWeight: '500',
    fontSize: '1rem',
    flex: '1',
    paddingRight: '20px'
  },
  skillControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flexShrink: '0'
  },
  statusBadge: {
    padding: '6px 15px',
    borderRadius: '15px',
    fontSize: '0.9rem',
    fontWeight: '500',
    minWidth: '130px',
    textAlign: 'center'
  },
  select: {
    padding: '8px 12px',
    border: '2px solid #4a69bd',
    borderRadius: '6px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
    minWidth: '150px',
    fontWeight: '500'
  },
  footer: {
    textAlign: 'center',
    marginTop: '50px',
    paddingTop: '20px',
    borderTop: '1px solid #e1e8ed'
  },
  footerText: {
    color: '#7f8c8d',
    marginBottom: '10px',
    fontSize: '0.9rem'
  },
  refreshButton: {
    padding: '10px 20px',
    background: '#4a69bd',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#f5f7fa'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #4a69bd',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginTop: '20px'
  },
  error: {
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#f5f7fa'
  },
  button: {
    padding: '10px 20px',
    background: '#4a69bd',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px'
  }
};

// Animation CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input:focus, select:focus {
    outline: none;
    border-color: #4a69bd !important;
    box-shadow: 0 0 0 3px rgba(74, 105, 189, 0.2);
  }
  
  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  }
  
  .theme-card:hover {
    box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  }
`;
document.head.appendChild(styleSheet);

export default App; 