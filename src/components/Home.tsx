import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import '../styles/Home.css';

function Home() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(false);

        const timer = setTimeout(() => {
        setIsVisible(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
        {isVisible && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <div>
                <Link to="/Quiz" className="answer_box2 answer_question2">
                始める
                </Link>
            </div>
            <div>
                <Link to="/Incorrect" className="answer_box2 answer_question2">
                間違えやすい問題
                </Link>
            </div>
            <div>
                <Link to="/Importer" className="answer_box2 answer_question2">
                インポート
                </Link>
            </div>
            <div>
                <Link to="/WordHint" className="answer_box2 answer_question2">
                用語集
                </Link>
            </div>
            </motion.div>
        )}
        </div>
    );
}

export default Home;
