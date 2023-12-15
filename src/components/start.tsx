import "../styles/start.css";
import { motion, useUnmountEffect } from "framer-motion";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Quiz from "./Quiz";
import Home from "./Home"
import title from "../img/第二候補.png";

export default function App() {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        setIsVisible(false);
    }, []);
    return (
        <div>
            <img src={title} alt="aa" />
            <div>
                <motion.div whileHover={{
                    scale: 1,
                    transition: { duration: 1 },
                }}
                    whileTap={{ scale: 1 }}>
                        <motion.div 
                initial={{opacity:0}}
                animate={{opacity:11}}
                transition={{duration:0.3}}>
                <Link to="/Home" className="start_button start_btn-border">
                    START
                </Link>
                </motion.div>
            </motion.div>
        </div>
        </div >
    );
}
