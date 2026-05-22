import { motion } from "framer-motion";

export default function Page({ children, className = "" }) {
  return (
    <motion.main
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.main>
  );
}
