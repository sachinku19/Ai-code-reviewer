import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { token, booting } = useAuth();
  if (booting) return <div className="screen-loader"><span />Booting secure workspace</div>;
  return token ? children : <Navigate to="/login" replace />;
}
