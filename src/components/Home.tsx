import { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';

import {motion} from "framer-motion"

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
                animate={{opacity:1}}
                transition={{duration:1}}>
                <div><Link to="/">ホーム</Link></div>
                <div><Link to="Quiz">クイズ</Link></div>
                <div><Link to="Incorrect">間違えやすい問題</Link></div>
                <li><Link to="/Importer">問題を追加</Link></li>
                <li><Link to="/WordHint">用語を覚えよう</Link></li>
            </motion.div>
            )}
        </div>
    );
    }

export default Home;