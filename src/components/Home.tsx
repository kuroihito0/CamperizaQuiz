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
        <div>
            {isVisible &&(
            <motion.div
                initial={{opacity:0}}
                animate={{opacity:1}}
                transition={{duration:1}}>
                <div><Link to="/">ホーム</Link></div>
                <div><Link to="Quiz">クイズ</Link></div>
            </motion.div>
            )}
        </div>
    );
    }

export default Home;