const ProgressBar = ({ percentage }) => {
  return (
    <div className="progress-container">
      <div className="progress-info">
        <span className="progress-label">Progression</span>
        <span className="progress-percentage">{percentage}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
