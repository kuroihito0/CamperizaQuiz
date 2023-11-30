import React, { useEffect,useState } from 'react';
import { BrowserRouter as Router, Route, Routes,Link } from 'react-router-dom';
import Quiz from "./Quiz";
import {motion} from "framer-motion"

function Home() {
    const [isVisible,setIsVisible] = useState(false);
    useEffect(()=>{
        setIsVisible(false); // ページがロードされたらisVisibleをtrueに設定してアニメーションをトリガー
        const timer = setTimeout(()=>{
            setIsVisible(true);
        },2000);//秒後にisVisibleをfalseに設定（アニメーションの時間に合わせて調整してください）

        return () => clearTimeout(timer);// コンポーネントがアンマウントされたらタイマーをクリア
    },[]);

    return (
        <div className="App">
            <ul>
                <li><Link to="/">ホーム</Link></li>
                <li><Link to="Quiz">クイズ</Link></li>
                <li><Link to="title">雨竜</Link></li>
            </ul>
    </div>
    );
    }

export default Home;