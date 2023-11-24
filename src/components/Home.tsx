import React from 'react';
import { BrowserRouter as Router, Route, Routes,Link } from 'react-router-dom';
import Quiz from "./Quiz";
function Home() {

    return (
        <div className="App">
            <ul>
                <li><Link to="/">ホーム</Link></li>
                <li><Link to="Quiz">クイズ</Link></li>
            </ul>
    </div>
    );
    }

export default Home;