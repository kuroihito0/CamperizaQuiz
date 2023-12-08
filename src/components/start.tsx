import "../styles/start.css";
import { motion} from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';


export default function App() {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        setIsVisible(false);
    }, []);
    return (
        <div>
            <div className="start_box">
                <h1 className="start_title">stuiz</h1>
            </div>
            <div>
                <motion.div whileHover={{
                    scale: 1.2,
                    transition: { duration: 1 },
                }}
                    whileTap={{ scale: 0.9 }}
                    >
                    
                <Link to="/Quiz" className="start_button start_btn-border">
                    START
                </Link>
            </motion.div>
        </div>
        </div >
    );
}