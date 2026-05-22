import { motion } from "framer-motion";
import { Bot, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { token } = useAuth();
  const links = [
    { to: "/", label: "Product" },
    { to: "/pricing", label: "Pricing" },
    { to: "/#faq", label: "FAQ" }
  ];

  return (
    <motion.header className="site-nav" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <Link className="brand" to="/">
        <span className="brand-mark"><Bot size={22} /></span>
        <span>AI Code Reviewer Pro</span>
      </Link>
      <nav className={open ? "nav-links open" : "nav-links"}>
        {links.map((link) =>
          link.to.includes("#") ? (
            <a key={link.label} href={link.to} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ) : (
            <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          )
        )}
      </nav>
      <div className="nav-actions">
        <Link className="ghost-button" to={token ? "/app" : "/login"}>{token ? "Dashboard" : "Login"}</Link>
        <Link className="primary-button" to={token ? "/app/workspace" : "/register"}>
          <Sparkles size={17} /> Start Reviewing
        </Link>
        <button className="icon-button mobile-only" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </motion.header>
  );
}
