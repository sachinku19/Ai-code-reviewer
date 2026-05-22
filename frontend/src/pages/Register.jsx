import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Page from "../components/common/Page.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    if (form.password.length < 8) return showToast("Password must be at least 8 characters", "error");
    setLoading(true);
    try {
      await register(form);
      showToast("Workspace created", "success");
      navigate("/app/workspace");
    } catch (error) {
      showToast(error.response?.data?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page className="auth-page">
      <Link className="brand auth-brand" to="/"><span className="brand-mark"><Bot size={22} /></span>AI Code Reviewer Pro</Link>
      <motion.form className="auth-card glass-card" onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="eyebrow">Create account</span>
        <h1>Start reviewing code like a pro.</h1>
        <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required minLength={2} /></label>
        <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
        <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} /></label>
        <button className="primary-button wide" disabled={loading}>{loading ? "Creating..." : <><Sparkles size={18} /> Create workspace</>}</button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </motion.form>
    </Page>
  );
}
