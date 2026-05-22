import { Bot, Github, ShieldCheck, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="brand footer-brand">
          <span className="brand-mark"><Bot size={20} /></span>
          <span>AI Code Reviewer Pro</span>
        </div>
        <p>Senior-level code review, optimization, explanation, and complexity analysis in a focused AI workspace.</p>
      </div>
      <div className="footer-grid">
        <span><Sparkles size={16} /> AI powered</span>
        <span><ShieldCheck size={16} /> JWT secured</span>
        <span><Github size={16} /> Deployment ready</span>
      </div>
    </footer>
  );
}
