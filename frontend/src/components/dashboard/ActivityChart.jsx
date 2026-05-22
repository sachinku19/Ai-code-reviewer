const values = [38, 62, 46, 78, 58, 88, 73, 95, 64, 84, 91, 76];

export default function ActivityChart() {
  return (
    <div className="glass-card chart-card">
      <div className="section-heading compact">
        <div>
          <span>Code activity</span>
          <h3>Review velocity</h3>
        </div>
        <strong>+27%</strong>
      </div>
      <div className="bar-chart" aria-label="Code review activity chart">
        {values.map((value, index) => (
          <span key={index} style={{ height: `${value}%` }} />
        ))}
      </div>
    </div>
  );
}
