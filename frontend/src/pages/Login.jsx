import { motion } from "framer-motion";
import { Bot, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Page from "../components/common/Page.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(form);
      showToast("Welcome back", "success");
      navigate("/app");
    } catch (error) {
      showToast(error.response?.data?.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page className="auth-page">
      <Link className="brand auth-brand" to="/"><span className="brand-mark"><Bot size={22} /></span>AI Code Reviewer Pro</Link>
      <motion.form className="auth-card glass-card" onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="eyebrow">Secure login</span>
        <h1>Resume your review command center.</h1>
        <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
        <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} /></label>
        <button className="primary-button wide" disabled={loading}>{loading ? "Authenticating..." : <><LogIn size={18} /> Login</>}</button>
        <p>New here? <Link to="/register">Create an account</Link></p>
      </motion.form>
    </Page>
  );
}
