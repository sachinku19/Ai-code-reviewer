import { BarChart3, BrainCircuit, Clock3, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import Page from "../components/common/Page.jsx";
import ActivityChart from "../components/dashboard/ActivityChart.jsx";
import StatCard from "../components/dashboard/StatCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { historyApi, userApi } from "../services/api.js";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalReviews: 0, averageScore: 0 });

  useEffect(() => {
    Promise.all([historyApi.list(), userApi.profile()]).then(([h, p]) => {
      setHistory(h.data.items.slice(0, 5));
      setStats(p.data.stats);
    });
  }, []);

  return (
    <Page className="dashboard page-pad">
      <div className="page-hero">
        <div><span className="eyebrow">Dashboard</span><h1>Welcome back, {user?.name?.split(" ")[0]}.</h1><p>Your AI review cockpit is warmed up and ready for clean code.</p></div>
        <Link className="primary-button" to="/app/workspace">New review</Link>
      </div>
      <div className="stats-grid">
        <StatCard icon={BrainCircuit} label="Total reviews" value={stats.totalReviews} trend="Saved in MongoDB" />
        <StatCard icon={ShieldCheck} label="Avg quality score" value={`${stats.averageScore || 0}/100`} trend="Across review history" />
        <StatCard icon={Clock3} label="Review speed" value="42s" trend="Typical AI response" />
        <StatCard icon={BarChart3} label="Complexity scans" value={history.length} trend="Recent sessions" />
      </div>
      <div className="dashboard-grid">
        <ActivityChart />
        <section className="glass-card recent-card">
          <div className="section-heading compact"><div><span>Recent reviews</span><h3>Latest AI sessions</h3></div><Link to="/app/history">View all</Link></div>
          <div className="review-list">
            {history.length === 0 ? <p className="muted">No reviews yet. Run your first one in the workspace.</p> : history.map((item) => (
              <Link className="review-row" to="/app/history" key={item._id}>
                <span>{item.language}</span>
                <strong>{item.title}</strong>
                <small>{new Date(item.createdAt).toLocaleString()}</small>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <section className="quick-actions">
        {["Review pasted code", "Optimize hot path", "Explain legacy logic"].map((item) => <Link className="glass-card action-card" to="/app/workspace" key={item}>{item}<span>Open workspace</span></Link>)}
      </section>
    </Page>
  );
}
