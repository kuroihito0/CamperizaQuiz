import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAuth, onAuthStateChanged, User as FirebaseAuthUser } from 'firebase/auth'; // 正しいFirebaseのauthパッケージを指定
import { Auth } from "./Auth_Re";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const auth = getAuth(); // Firebaseのauthオブジェクトを取得

function Home() {
    const [isVisible, setIsVisible] = useState(false);
    const [user, setUser] = useState<FirebaseAuthUser | null>(null);
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 500);

        const unsubscribe = onAuthStateChanged(auth, (user: FirebaseAuthUser | null) => {
            setUser(user);
        });

        return () => {
            clearTimeout(timer);
            unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/');
        } catch (error) {
            console.error('ログアウトエラー:', error);
        }
    };

    return (
        <div>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 11 }}
                    transition={{ duration: 1 }}>
                    <div><Link to="../Quiz" className='answer_box2 answer_question2'>始める</Link></div>
                    <div><Link to="../Incorrect" className='answer_box2 answer_question2'>間違えやすい問題</Link></div>
                    <div><Link to="../Importer" className='answer_box2 answer_question2'>インポート</Link></div>
                    <div><Link to="../WordHint" className='answer_box2 answer_question2'>用語集</Link></div>

                    {/* ログアウトボタン */}
                    <div className='Home_button' id="Home_button5">
                        {user ? (
                            <>

                                <button onClick={handleLogout}>ログアウト</button>
                                <h2>ログイン中: {user.displayName || 'No Name'}</h2>
                            </>
                        ) : (
                            isAuth && <Auth setIsAuth={setIsAuth} />
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default Home;
