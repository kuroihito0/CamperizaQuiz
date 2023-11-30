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
    const [isSubmitted, setIsSubmitted] = useState(false);


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
        if (!isSubmitted) {
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
                console.log("pointlist",dcbpointlist);
            }catch(error){
                console.error("データの取得に失敗！")
            }
            }
        */



            // コンポーネント内でuseStateを使ってstateを管理
    const [questions, setQuestions] = useState(["HI"]);
    const getModaniData = async () => {
        const technologyCollection = collection(db, 'Technology');
        const querySnapshot = await getDocs(technologyCollection);

        const 新しいQuestions = [];

        querySnapshot.forEach((doc) => {
            let 問題文 = doc.data().問題文;
            let ア = doc.data().ア;
            let イ = doc.data().イ;
            let ウ = doc.data().ウ;
            let エ = doc.data().エ;
            let 解答 = doc.data().解答;
            let 解説 = doc.data().解説;

            let 新しい問題データ = {
                questionText: 問題文,
                answerOptions: [
                    { answerText: ア, isCorrect: false },
                    { answerText: イ, isCorrect: false },
                    { answerText: ウ, isCorrect: false },
                    { answerText: エ, isCorrect: false },
                ],
            };
    
            // answer と answerText を比較して同じだったら isCorrect を true に設定
            新しい問題データ.answerOptions.forEach(option => {
                if (option.answerText === 解答) {
                    option.isCorrect = true;
                }
            });
            新しいQuestions.push(新しい問題データ);
        });
        console.log('新しいQuestions:', 新しいQuestions);
        setQuestions([...新しいQuestions]); // スプレッド演算子を使って新しい問題データの配列を渡す
        console.log('questions ステートdayo:', questions);
};
    
    // useEffectを使って状態が更新されたらログを出力
    useEffect(() => {
        console.log('questions ステートだ:', questions);
    }, [questions]);

/*  const [questions, setQuestions] = useState(新しい問題データ) =[
        {
            questionText: 新しい問題データ.問題文,
            answerOptions: [
                { answerText: 新しい問題データ.ア, isCorrect: true },
                { answerText: 新しい問題データ.イ, isCorrect: false },
                { answerText: 新しい問題データ.ウ, isCorrect: false },
                { answerText: 新しい問題データ.エ, isCorrect: false },
            ],
        }
    ]*/

<<<<<<< HEAD
=======
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
>>>>>>> 6a71c8962eb438afe595ff6b972ee32aaa89fe74

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);

    const handleAnswerButtonClick = (isCorrect) => {
        if (isCorrect) {
            alert('正解です');
            setScore(score + 10);
        } else {
            alert('不正解です');
        }

        const nextQuestion = currentQuestion + 1;

        if (nextQuestion < 10) {
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
                    <span className="correct">10問中{score}問</span>正解です
                    <button onClick={handleSubmission} disabled={isSubmitted} >送信</button>
                    <button onClick={getModaniData}>テスト</button>
                    {showScore && (
                        <div>
                            <ul>
                                {pointlist
                                    .slice(0, 5)
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
                    getModaniData={getModaniData}
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