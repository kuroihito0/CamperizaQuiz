import { useEffect, useState } from 'react';
import Answer from './Answer';
import {
    addDoc,
    collection,
    serverTimestamp,
    onSnapshot,
    query,
    getDoc,
    doc,
    setDoc,
    getDocs
} from 'firebase/firestore';

import { auth, db } from '../firebase-config';
import '../styles/Chat.css';


const Quiz = (props) => {

    const [pointlist, setPointlist] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [messages] = useState([]);

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
                
                const pointlist:any = [];
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
        console.log('isSubmitted:', isSubmitted);
        if (!isSubmitted) {
            setIsSubmitted(true);
            console.log('isSubmitted:', isSubmitted);
            // handleSub 関数を呼び出す
            await handleSub();
        }
    };

    const handleSub = async () => {
        try {
            // ユーザー名を取得
            const userName = auth.currentUser?.displayName;
    
            const data = {
                text: score.toString(),
                createAt: serverTimestamp(),
                user: `${userName}`, // ユーザー名を追加
            };
    
            // データを送信
            await addDoc(collection(db, "Point"), data);
            console.log("データが正常に送信されました");
    
            // 他の必要な処理を追加
        } catch (error) {
            console.error("データの送信に失敗:", error);
        }
    };




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
    const [questions, setQuestions] = useState([""]);
    const getModaniData = async () => {
        const technologyCollection = collection(db, 'Technology');
        const querySnapshot = await getDocs(technologyCollection);

        const 新しいQuestions = [];

        querySnapshot.forEach((doc) => {
            let 問題文 = doc.data().問題文;
            let 問題ID = doc.data().問題ID;
            let ア = doc.data().ア;
            let イ = doc.data().イ;
            let ウ = doc.data().ウ;
            let エ = doc.data().エ;
            let 解答 = doc.data().解答;
            //let 解説 = doc.data().解説;

            let 新しい問題データ = {
                questionText: 問題文,
                questionID: 問題ID,
                answerOptions: [
                    { answerText: ア, isCorrect: false, number: 1 },
                    { answerText: イ, isCorrect: false, number: 2 },
                    { answerText: ウ, isCorrect: false, number: 3 },
                    { answerText: エ, isCorrect: false, number: 4 },
                ],
            };

            // answer と answerText を比較して同じだったら isCorrect を true に設定
            新しい問題データ.answerOptions.forEach(option => {
                if (option.number === 解答) {
                    option.isCorrect = true;
                }
            });
            新しいQuestions.push(新しい問題データ);
        });
        setQuestions([...新しいQuestions]); // スプレッド演5算子を使って新しい問題データの配列を渡す
    };

    // useEffectを使って状態が更新されたらログを出力
    useEffect(() => {
        console.log('questions ステートだ:', questions);
    }, [questions]);


    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);

    const handleAnswerButtonClick = (isCorrect:any, questionID:any) => {
        if (isCorrect) {
            alert('正解です');
            setScore(score + 1);
        } else {
            const incorrectQuestionId = questionID; // ここで適切な問題IDを取得する必要があります
            addIncorrectQuestion(incorrectQuestionId);
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

    const addIncorrectQuestion = async (incorrectQuestionId) => {
        try {
            const stringId = String(incorrectQuestionId);
            const docRef = doc(db,"InCorrect",stringId);

            const docSnapshot = await getDoc(docRef);

            if(docSnapshot.exists()){
                const currentCount = docSnapshot.data().count || 0;
                const newCount = currentCount + 1
              // 更新するデータ
            const updatedData = {
                count: newCount,
                // 他に更新したいフィールドがあればここに追加
                createAt: serverTimestamp(),
                user: auth.currentUser?.displayName,
            };

            // データを更新
            await setDoc(docRef, updatedData);

            console.log("不正解の問題が正常に送信・更新されました");
        } else {
            // ドキュメントが存在しない場合は新規作成
            const data = {
                incorrectQuestionId: incorrectQuestionId,
                count: 1,  // 初回の不正解なので 1 からスタート
                createAt: serverTimestamp(),
                user: auth.currentUser?.displayName,
            };

            // データを送信
            await setDoc(docRef, data);

            console.log("新しい不正解の問題が正常に送信されました");
        }

        // 他の必要な処理を追加
    } catch (error) {
        console.error("不正解の問題の送信・更新に失敗:", error);
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
                    <button onClick={handleSubmission} disabled={isSubmitted}>送信</button>
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