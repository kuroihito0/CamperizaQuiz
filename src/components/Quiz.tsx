// 省略なしのコード
import { useEffect, useState } from 'react';
import Answer from './Answer';
import {
    addDoc,
    collection,
    serverTimestamp,
    onSnapshot,
    query,
    doc,
    setDoc,
    getDocs,
    where,
} from 'firebase/firestore';

import { auth, db } from '../firebase-config';
import '../styles/Chat.css';
import { Link } from "react-router-dom";

const Quiz = (props: any) => {
    const [pointlist, setPointlist] = useState<any[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [incorrectQuestions, setIncorrectQuestions] = useState<any[]>([]);
    const [selectedQuestionIDs, setSelectedQuestionIDs] = useState<string[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'messages')),
            (snapshot) => {
                const updatedMessages: any[] = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const text = data['text'];
                    updatedMessages.push({ text, id: doc.id });
                });
                setMessages(updatedMessages);
            }
        );

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Point'));

                const pointlist: any[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    pointlist.push(data);
                });
                pointlist.sort((a, b) => b.text - a.text);
                setPointlist(pointlist);
            } catch (error) {
                console.error('データの取得に失敗:', error);
            }
        };
        fetchData();
    }, []);

    const handleSubmission = async () => {
        console.log('isSubmitted:', isSubmitted);
        if (!isSubmitted) {
            setIsSubmitted(true);
            console.log('isSubmitted:', isSubmitted);
            await handleSub();
        }
    };

    const handleSub = async () => {
        try {
            const userName = auth.currentUser?.displayName;

            const data = {
                text: score.toString(),
                createAt: serverTimestamp(),
                user: `${userName}`,
            };

            await addDoc(collection(db, 'Point'), data);
            console.log('データが正常に送信されました');
        } catch (error) {
            console.error('データの送信に失敗:', error);
        }
    };

    const fetchRankingData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'Point'));
            const data: any[] = [];
            querySnapshot.forEach((doc) => {
                data.push(doc.data());
            });
            data.sort((a, b) => b.text - a.text);
            setPointlist(data);
        } catch (error) {
            console.error('データの取得に失敗:', error);
        }
    };

    useEffect(() => {
        fetchRankingData();
        const unsubscribe = onSnapshot(query(collection(db, 'Point')), () => {
            fetchRankingData();
        });
        return () => unsubscribe();
    }, []);

    const [questions, setQuestions] = useState<any>([]);

    const getModaniData = async () => {
        const technologyCollection = collection(db, 'Technology');
        const querySnapshot = await getDocs(technologyCollection);

        const 新しいQuestions: any[] = [];

        querySnapshot.forEach((doc) => {
            const 問題文 = doc.data()['問題文'];
            const 問題ID = doc.data()['問題ID'];
            const ア = doc.data()['ア'];
            const イ = doc.data()['イ'];
            const ウ = doc.data()['ウ'];
            const エ = doc.data()['エ'];
            const 解答 = doc.data()['解答'];
            const 解説 = doc.data()['解説'];

            const 新しい問題データ = {
                questionText: 問題文,
                questionID: 問題ID,
                questionEx:解説,
                answerOptions: [
                    { answerText: ア, isCorrect: false, number: 1 },
                    { answerText: イ, isCorrect: false, number: 2 },
                    { answerText: ウ, isCorrect: false, number: 3 },
                    { answerText: エ, isCorrect: false, number: 4 },
                ],
            };

            新しい問題データ.answerOptions.forEach((option: any) => {
                if (option.number === 解答) {
                    option.isCorrect = true;
                }
            });
            新しいQuestions.push(新しい問題データ);
        });
        setQuestions([...新しいQuestions]);
    };

    useEffect(() => {
        console.log('questions ステートだ:', questions);
    }, [questions]);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);


    const addIncorrectQuestion = async (questionID: any) => {
        try {
            const technologyQuery = query(collection(db, "Technology"), where("問題ID", "==", questionID));
            const technologyQuerySnapshot = await getDocs(technologyQuery);

            if (!technologyQuerySnapshot.empty) {
                // ドキュメントが存在する場合
                const technologyDoc = technologyQuerySnapshot.docs[0];
                const technologyDocData = technologyDoc.data();//?

                // InCorrectCountが存在するか確認
                if ("InCorrectCount" in technologyDocData) {
                    // ドキュメントにInCorrectCountが存在する場合、+1して更新
                    const currentCount = technologyDocData['InCorrectCount'];//?
                    const newCount = currentCount + 1;

                    // 更新するデータ
                    const updatedData = {
                        InCorrectCount: newCount,
                        // 他に更新したいフィールドがあればここに追加
                    };

                    // データを更新
                    await setDoc(technologyDoc.ref, updatedData, { merge: true });
                    console.log("不正解の問題が正常に更新されました");
                } else {
                    // InCorrectCountが存在しない場合、追加して初期値を1にする
                    const updatedData = {
                        InCorrectCount: 1,
                        // 他に更新したいフィールドがあればここに追加
                    };

                    // データを更新
                    await setDoc(technologyDoc.ref, updatedData, { merge: true });
                    console.log("InCorrectCountが存在しないため、追加して初期化しました");
                }
            } else {
                console.error("指定された問題IDに対応するTechnologyドキュメントが見つかりませんでした");
            }
        } catch (error) {
            console.error("不正解の問題の更新に失敗:", error);
        }
    };
    const [fire, setfire] = useState(true);

    const handleAnswerButtonClick = (isCorrect: any, questionID: any) => {
        setSelectedQuestionIDs((prevIDs) => {
            // prevIDs を使用して新しい状態を計算
            const newIDs = [...prevIDs, questionID];

            // 新しい状態をコンソールに出力
            console.log(newIDs);

            return newIDs;
        });

        if (isCorrect) {
            setScore((prevScore) => prevScore + 1);
            console.log("正解です");
        } else {
            const incorrectQuestionId = questionID;
            addIncorrectQuestion(incorrectQuestionId);
            console.log("不正解です");
        }

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < 10) {
            setCurrentQuestion(nextQuestion);
        } else {
            setShowScore(true);
            props.getPointValue(score);
        }
    };

    /*const addIncorrectQuestion2 = async (incorrectQuestionId: any) => {
        try {
            const stringId = String(incorrectQuestionId);
            const docRef = doc(db, 'InCorrect', stringId);

            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                const currentCount = docSnapshot.data()['count'] || 0;
                const newCount = currentCount + 1;

                const updatedData = {
                    count: newCount,
                    createAt: serverTimestamp(),
                    user: auth.currentUser?.displayName,
                };

                await setDoc(docRef, updatedData);

                console.log('不正解の問題が正常に送信・更新されました');
            } else {
                const data = {
                    incorrectQuestionId: incorrectQuestionId,
                    count: 1,
                    createAt: serverTimestamp(),
                    user: auth.currentUser?.displayName,
                };

                await setDoc(docRef, data);

                console.log('新しい不正解の問題が正常に送信されました');
            }
        } catch (error) {
            console.error('不正解の問題の送信・更新に失敗:', error);
        }
    };*/

    /*    const getRandomDocument = async () => {
            try {
                // コレクション内のすべてのドキュメントを取得
                const querySnapshot = await getDocs(collection(db, 'messages'));
    
                // ランダムなインデックスを生成
                const randomIndex = Math.floor(Math.random() * querySnapshot.size);
    
                // ランダムなドキュメントを選択
                const randomDoc = querySnapshot.docs[randomIndex];
    
                if (randomDoc) {
                    return randomDoc.data();
                } else {
                    // ドキュメントが存在しない場合の処理
                    return null;
                }
            } catch (error) {
                return null;
            }
        };
    */



    return (
        <div className="App">
            {showScore ? (
                <h1>
                    お疲れ様でした!
                    <br />
                    <span className="correct">10問中<span className='score'>{score}問</span>正解です</span>
                    <div className="border"></div>
                    {showScore && (
                        <div>
                            <p>ランキング:TOP5</p>
                            <ul>
                                {pointlist
                                    .slice(0, 5)
                                    .map((item, index) => (

                                        <li key={index}>
                                            <span className="player">プレイヤー名: {item.user}, スコア: {item.text}</span>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}
                    <div className="border"></div>
                    <button onClick={handleSubmission} disabled={isSubmitted} className='Quiz_button '>送信</button>
                    <Link to="/" className='Quiz_button2 '>ホーム</Link>

                </h1>)
                : (
                    <Answer
                        handleAnswerButtonClick={handleAnswerButtonClick}
                        questions={questions}
                        currentQuestion={currentQuestion}
                        getModaniData={getModaniData}
                    />
                )}
        </div>
    );
};

export default Quiz;
