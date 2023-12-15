import "../styles/start.css";
import { motion} from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import title from "../img/icon.png";

export default function App() {
    const [isVisible] = useState(false);

    useEffect(() => {
        console.log(isVisible);
    }, [isVisible]);
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