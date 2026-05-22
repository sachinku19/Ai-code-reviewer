import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import Page from "../components/common/Page.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { userApi } from "../services/api.js";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: "", bio: "", avatarColor: "#7c3aed", plan: "Starter" });
  const [stats, setStats] = useState({ totalReviews: 0, averageScore: 0 });
  const { showToast } = useToast();

  useEffect(() => {
    userApi.profile().then(({ data }) => {
      setForm({ name: data.user.name, bio: data.user.bio || "", avatarColor: data.user.avatarColor, plan: data.user.plan });
      setStats(data.stats);
    });
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const { data } = await userApi.updateProfile(form);
    setUser(data.user);
    localStorage.setItem("acr_user", JSON.stringify(data.user));
    showToast("Profile updated", "success");
  };

  return (
    <Page className="profile page-pad">
      <div className="page-hero compact-hero"><div><span className="eyebrow">Profile</span><h1>Your developer identity</h1></div></div>
      <div className="profile-grid">
        <section className="glass-card profile-card">
          <span className="avatar xl" style={{ background: form.avatarColor }}>{form.name?.slice(0, 1) || user?.name?.slice(0, 1)}</span>
          <h2>{form.name}</h2>
          <p>{user?.email}</p>
          <div className="profile-stats"><span><strong>{stats.totalReviews}</strong> Reviews</span><span><strong>{stats.averageScore}</strong> Avg score</span></div>
        </section>
        <form className="glass-card form-card" onSubmit={submit}>
          <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
          <label>Bio<textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={220} /></label>
          <label>Avatar glow<input type="color" value={form.avatarColor} onChange={(e) => setForm({ ...form, avatarColor: e.target.value })} /></label>
          <label>Plan<select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}><option>Starter</option><option>Pro</option><option>Team</option></select></label>
          <button className="primary-button"><Save size={17} /> Save profile</button>
        </form>
      </div>
    </Page>
  );
}
