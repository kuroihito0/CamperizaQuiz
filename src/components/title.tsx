import "../styles/title.css";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function App() {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        setIsVisible(false);

        document.body.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });

        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        if (window.location.pathname === "/title") {
            setTimeout(() => {
                window.location.href = "/start";
            }, 3 * 1000);
        }

        return () => clearTimeout(timer);
    }, []);
    return (
        <div>
            {isVisible && (
                <motion.div
                    className="start_box"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.3,
                        ease: [0, 0.71, 0.2, 1.01],
                        scale: {
                            type: "spring",
                            damping: 5,
                            stiffness: 800,
                            restDelta: 0.001
                        }
                    }}
                        >
                        <h1 className="title_title">stuiz</h1>
                        
                </motion.div>
                )}
            </div >
    );
}