const SkillItem = ({ skill, onStatusChange }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'acquired': return '#4caf50';
      case 'in-progress': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  return (
    <div className="skill-item">
      <span className="skill-name">{skill.name}</span>
      <select
        className="skill-status"
        value={skill.status}
        onChange={(e) => onStatusChange(skill.id, e.target.value)}
        style={{ borderColor: getStatusColor(skill.status) }}
      >
        <option value="not-started">❌ Non commencé</option>
        <option value="in-progress">🔄 En cours</option>
        <option value="acquired">✅ Acquis</option>
      </select>
    </div>
  );
};

export default SkillItem;
