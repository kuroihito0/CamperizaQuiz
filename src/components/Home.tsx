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
                    <div className='Home_button' id="Home_button1"><Link to="Quiz"><button>始める</button></Link></div>
                    <div className='Home_button' id="Home_button2"><Link to="Incorrect"><button>間違えやすい問題</button></Link></div>
                    <div className='Home_button' id="Home_button3"><Link to="Importer"><button>インポート</button></Link></div>
                    <div className='Home_button' id="Home_button4"><Link to="WordHint"><button>用語集</button></Link></div>

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
