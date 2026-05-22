import { BarChart3, Code2, CreditCard, History, LogOut, Menu, Settings, UserRound, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const nav = [
    { to: "/app", label: "Dashboard", icon: BarChart3, end: true },
    { to: "/app/workspace", label: "Workspace", icon: Code2 },
    { to: "/app/history", label: "History", icon: History },
    { to: "/pricing", label: "Pricing", icon: CreditCard },
    { to: "/app/profile", label: "Profile", icon: UserRound },
    { to: "/app/settings", label: "Settings", icon: Settings }
  ];

  const signOut = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <button className="icon-button close-sidebar" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={18} /></button>
        <div className="sidebar-brand">
          <span className="brand-mark">AI</span>
          <div>
            <strong>Code Reviewer Pro</strong>
            <small>Assistant console</small>
          </div>
        </div>
        <nav>
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} end={item.end} to={item.to} onClick={() => setOpen(false)}>
                <Icon size={19} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="sidebar-user">
          <span className="avatar" style={{ background: user?.avatarColor }}>{user?.name?.slice(0, 1) || "U"}</span>
          <div>
            <strong>{user?.name}</strong>
            <small>{user?.plan} plan</small>
          </div>
        </div>
        <button className="logout-button" onClick={signOut}><LogOut size={18} /> Logout</button>
      </aside>
    </>
  );
}
