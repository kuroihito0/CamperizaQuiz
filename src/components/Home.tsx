import React, { useEffect,useState } from 'react';
import { BrowserRouter as Router, Route, Routes,Link } from 'react-router-dom';
import Quiz from "./Quiz";
import Incorrect from './Incorrect';
import {motion} from "framer-motion"
import title from "../img/第二候補.png";
import Import from './Importer';
import WordHint from './WordHint';
import "../styles/Home.css";
function Home() {
    const [isVisible,setIsVisible] = useState(false);
    useEffect(()=>{
        setIsVisible(false); // ページがロードされたらisVisibleをtrueに設定してアニメーションをトリガー
        const timer = setTimeout(()=>{
            setIsVisible(true);
        },500);//秒後にisVisibleをfalseに設定（アニメーションの時間に合わせて調整してください）

        return () => clearTimeout(timer);// コンポーネントがアンマウントされたらタイマーをクリア
    },[]);

    return (
        <div>
            {isVisible &&(
            <motion.div
                initial={{opacity:0}}
                animate={{opacity:11}}
                transition={{duration:1}}>
                <div className='Home_button' id="Home_button1"><Link to="Quiz"><button>始める</button></Link></div>
                <div className='Home_button' id="Home_button2"><Link to="Incorrect"><button>間違えやすい問題</button></Link></div>
                <div className='Home_button' id="Home_button3"><Link to="Importer"><button>インポート</button></Link></div>
                <div className='Home_button' id="Home_button4"><Link to="WordHint"><button>用語集</button></Link></div>
            </motion.div>
            )}
        </div>
    );
    }

export default Home;