import ThemeCard from './ThemeCard';

const ThemeList = ({ themes, onDeleteTheme, onSkillStatusChange }) => {
  if (!themes || themes.length === 0) {
    return (
      <div className="empty-state">
        <p>Aucun thème disponible. Ajoutez-en un !</p>
      </div>
    );
  }

  return (
    <div className="themes-list">
      {themes.map(theme => (
        <ThemeCard
          key={theme.id}
          theme={theme}
          onDelete={onDeleteTheme}
          onSkillStatusChange={onSkillStatusChange}
        />
      ))}
    </div>
  );
};

export default ThemeList;
