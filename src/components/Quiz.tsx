// 省略なしのコード
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
    getDocs,
} from 'firebase/firestore';

import { auth, db } from '../firebase-config';
import '../styles/Chat.css';

const Quiz = (props: any) => {
    const [pointlist, setPointlist] = useState<any[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);

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

            const 新しい問題データ = {
                questionText: 問題文,
                questionID: 問題ID,
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

    const handleAnswerButtonClick = (isCorrect: any, questionID: any) => {
        if (isCorrect) {
            alert('正解です');
            setScore(score + 1);
        } else
        {
            const incorrectQuestionId = questionID;
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

    const addIncorrectQuestion = async (incorrectQuestionId: any) => {
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
    };

    const getRandomDocument = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'messages'));
            const randomIndex = Math.floor(Math.random() * querySnapshot.size);
            const randomDoc = querySnapshot.docs[randomIndex];
            return randomDoc?.data() || {}; // 追加行: ドキュメントがない場合は空のオブジェクトを返す
        } catch (error) {
            console.error('ドキュメントの取得に失敗:', error);
        }
    };

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
                    <button onClick={handleSubmission} disabled={isSubmitted}>
                        送信
                    </button>
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
