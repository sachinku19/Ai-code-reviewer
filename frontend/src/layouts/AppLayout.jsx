import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar.jsx";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <section className="app-main">
        <Outlet />
      </section>
    </div>
  );
}
