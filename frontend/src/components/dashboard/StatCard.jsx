import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, label, value, trend }) {
  return (
    <motion.article className="stat-card glass-card" whileHover={{ y: -4 }}>
      <span className="stat-icon"><Icon size={21} /></span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>{trend}</small>
      </div>
    </motion.article>
  );
}
