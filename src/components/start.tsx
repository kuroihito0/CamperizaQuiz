import "../styles/start.css";
import { motion, useUnmountEffect } from "framer-motion";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes,Link } from 'react-router-dom';
import Quiz from "./Quiz";

export default function App() {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        setIsVisible(false);
    }, []);
    return (
        <div>
            <div className="box">
                <h1 className="title">stuiz</h1>
            </div>
            <div>
            <Link to="/Quiz" className="btn btn-border">
                    すたあぁつ
                    </Link>
                
            </div>
                
        </div>
    );
}
