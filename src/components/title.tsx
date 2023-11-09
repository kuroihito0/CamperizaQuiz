import "./styles.css";
import { motion } from "framer-motion";

export default function App() {
    return (
    <motion.div
    className="box"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01]
    }}
    />
    );
}
