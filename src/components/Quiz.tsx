import { useEffect, useState } from 'react';
import Answer from './Answer';
import {
    addDoc,
    collection,
    serverTimestamp,
    onSnapshot,
    query,
    where,
    getDoc,
    doc,
    setDoc,
    getDocs,
    queryEqual,
    QuerySnapshot,
} from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import '../styles/Chat.css';

const Quiz = (props) => {
    const { room } = props;
    const [messages, setMessages] = useState([]);
    const messagesRef = collection(db, 'messages');
    const [pointlist, setPointlist] = useState([]);
    const [isSubmitted,setIsSubmitted] = useState(false);


    /*useEffect(() => {
        const unsubscribe = onSnapshot(
            query(messagesRef, where('room', '==', room)),
            (snapshot) => {
                let updatedMessages = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const text = data['text'];
                    updatedMessages.push({ text, id: doc.id });
                });
                setMessages(updatedMessages);
            }
        );

        return () => unsubscribe();
    }, [room]);
/*
    const handleSubmit = async (e) => {
        e.preventDefault();

        await addDoc(messagesRef, {
            text: score.toString(),
            createdAt: serverTimestamp(),
            user: auth.currentUser?.displayName,
            room,
        });
        setNewMessage('');
    };
*/


    useEffect(() => {
            // ランキング情報を取得するコード（pointlistを取得）
            const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Point'));
                const pointlist = [];
                querySnapshot.forEach((doc) => {
                const data = doc.data();
                pointlist.push(data);
                });
                pointlist.sort((a, b) => b.text - a.text); // ポイントで降順にソート
                setPointlist(pointlist);
            } catch (error) {
                console.error("データの取得に失敗:", error);
            }
            };
            fetchData();
        }, []);


    const handleSubmission = async () => {
        if(!isSubmitted){
            setIsSubmitted(true);
            const handleSub = async (e) => {
                e.preventDefault();
                const data = {
                    text: score.toString(),
                    createAt: serverTimestamp(),
                    user: auth.currentUser?.displayName,
                    room
                };
                await addDoc(collection(db, "Point"), data);
            } 
        }
    }


    // Firestoreからデータを取得してランキングデータを更新
    const fetchRankingData = async () => {
        try {
        const querySnapshot = await getDocs(collection(db, 'Point'));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        data.sort((a, b) => b.text - a.text);
        setPointlist(data);
        } catch (error) {
        console.error('データの取得に失敗:', error);
        }
    };

        // コンポーネントがマウントされたときにデータを取得
    useEffect(() => {
        fetchRankingData();
        // Firestoreのデータ変更をリアルタイムで監視
        const unsubscribe = onSnapshot(query(collection(db, 'Point')), (snapshot) => {
        fetchRankingData(); // データが変更されたときに再度データを取得
        });
        return () => unsubscribe(); // コンポーネントがアンマウントされるときに監視を解除
    }, []);

    
        let 問題ID = '';
        let 問題文 = '';
        let 解答 = '';
        let 解説 = '';
        let ア = "";
        let イ = "";
        let ウ = "";
        let エ = "";
        const getModaniData = async () => {
            const technologyCollection = collection(db, 'Technology');
            try {
            const querySnapshot = await getDocs(technologyCollection); 
            querySnapshot.forEach((doc) => {
                問題ID = doc.data().問題ID;
                問題文 = doc.data().問題文;
                解答 = doc.data().解答;
                解説 = doc.data().解説;
                ア = doc.data().ア;
                イ = doc.data().イ;
                ウ = doc.data().ウ;
                エ = doc.data().エ;
            });
                console.log('問題ID:', 問題ID);
                console.log('問題文:', 問題文);
                console.log('解答:', 解答);
                console.log('解説:', 解説);
                console.log('ア:', ア);
                console.log('イ:',イ);
                console.log('ウ:', ウ);
                console.log('エ:', エ);
            } catch (error) {
            console.error('ドキュメントの取得に失敗:', error);
            }
        };

    
/*
    const rankSubmit = async (e) => {
        try{
            e.preventDefault();
            const querySnapshot = await getDocs(pointRef);
            const pointlist = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const playscore = data.text;
                const player = data.user; // "text" フィールドの値を取得
                console.log("プレイヤー名：",player,"スコア：",playscore);

                pointlist.push(playscore);
                pointlist.sort((a, b) => b.text - a.text);
            });
            console.log("pointlist",pointlist);
        }catch(error){
            console.error("データの取得に失敗！")
        }
        }
    */


    const questions = [
        {
            questionText: "ikemen",
            answerOptions: [
                { answerText: 'あ', isCorrect: true },
                { answerText: 'い', isCorrect: false },
                { answerText: 'なんだろうな', isCorrect: false },
            ],
        },
        {
            questionText: 'この難易度は？',
            answerOptions: [
                { answerText: 'なんだろうな', isCorrect: false },
                { answerText: ' カブ', isCorrect: false },
                { answerText: '鳥', isCorrect: true },
            ],
        },
        {
            questionText: 'おみそしるは？',
            answerOptions: [
                { answerText: 'なんだろうな', isCorrect: false },
                { answerText: 'たい焼き', isCorrect: true },
                { answerText: '🎈', isCorrect: false },
            ],
        },
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);


    const handleAnswerButtonClick = (isCorrect) => {
        if (isCorrect) {
            alert('正解です');
            setScore(score + 6);
        } else {
            alert('不正解です');
        }

        const nextQuestion = currentQuestion + 1;

        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setShowScore(true);
            props.getPointValue(score);
        }
    };

    const getRandomDocument = async () => {
        // コレクション内のすべてのドキュメントを取得
        const querySnapshot = await getDocs(collection(db, 'messages'));
    
        // ランダムなインデックスを生成
        const randomIndex = Math.floor(Math.random() * querySnapshot.size);
    
        // ランダムなドキュメントを選択
        const randomDoc = querySnapshot.docs[randomIndex];
        return randomDoc.data();
    };
    
    // ランダムなドキュメントを取得
    getRandomDocument()
        .then((data) => {
            console.log('ランダムなドキュメントのデータ:', data);
        })
        .catch((error) => {
            console.error('ドキュメントの取得に失敗:', error);
        });

    return (
        <div className="App">
            {showScore ? (
                <p>
                    お疲れ様でした!
                    <br />
                    <span className="correct">3問中{score}問</span>正解です
                    <button onClick={handleSubmission} disabled={isSubmitted} >送信</button>
                    <button onClick={getModaniData}>テスト</button>
                    {showScore && (
        <div>
        <h1>ランキング</h1>
        <ul>
            {pointlist
            .slice(0,5)
            .map((item, index) => (
            <li key={index}>
                プレイヤー名: {item.user}, スコア: {item.text}
            </li>
            ))}
        </ul>
        </div>
    )}

                </p>
            ) : (
                <Answer
                    handleAnswerButtonClick={handleAnswerButtonClick}
                    questions={questions}
                    currentQuestion={currentQuestion}
                />
            )}
            <div className="chat-app">
                {messages.map((message) => (
                    <p key={message.id}>
                        <p>{message.text}</p>
                    </p>
                ))}
            </div>
        </div>
    );
};

export default Quiz;