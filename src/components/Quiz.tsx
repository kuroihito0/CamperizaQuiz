import { useEffect, useState } from 'react';
import Answer from './Answer';
import {
    addDoc,
    collection,
    serverTimestamp,
    onSnapshot,
    query,
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
    
    const [isButtonVisible, setIsButtonVisible] = useState(true);

    const [selectedQuestionIDs, setSelectedQuestionIDs] = useState<string[]>([]);

    const test = () => {
        console.log(messages, selectedQuestionIDs)

    }
    test()

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
        console.log('isSubmitted before:', isSubmitted);
        console.log('isButtonVisible:', isButtonVisible);
        if (!isSubmitted) {
            setIsSubmitted(true);
            setIsButtonVisible(false);
            console.log('isSubmitted after:', isSubmitted);
            console.log('isButtonVisible after:', isButtonVisible);
            await handleSub();
        }
    };
    const setQuestionTexts = (textsArray: string[]) => {
        // textsArrayが空でない場合、問題文が格納された配列をステートにセット
        if (textsArray.length > 0) {
            setQuestionTextsArray(textsArray);
        }
    };
/*
    const Kaisetsu = async (questionText: string, explanation: string) => {
        console.log('isSubmitted:', isSubmitted);
        if (!isSubmitted) {
            setIsSubmitted(true);
            console.log('isSubmitted:', isSubmitted);
    
            // 解説を格納するための配列を用意
            const explanationsArray: string[] = [];
            // 問題文を格納するための配列を用意
            const questionTextsArray: string[] = [];
    
            // 10問答えた後、各問題の解説と問題文を取得
            for (const questionID of selectedQuestionIDs) {
                // 解説と問題文を取得
                const { explanation, questionText } = await fetchQuestionData(questionID);
    
                // 取得した解説があれば配列に追加
                if (explanation !== undefined) {
                    explanationsArray.push(explanation);
                }
    
                // 取得した問題文があれば配列に追加
                if (questionText !== undefined) {
                    questionTextsArray.push(questionText);
                }
            }
    
            // 解説と問題文が格納された配列をステートにセット
            setQuestionExplanation(explanationsArray.join('\n'));
            setQuestionTexts(questionTextsArray);
    
            // 問題文と解説をコンソールに出力
            console.log('問題文:', questionText);
            console.log('解説:', explanation);
        }
    };*/
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
                questionEx: 解説,
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

                if (technologyDoc) {
                    const technologyDocData = technologyDoc.data();

                    // InCorrectCountが存在するか確認
                    if ("InCorrectCount" in technologyDocData) {
                        // ドキュメントにInCorrectCountが存在する場合、+1して更新
                        const currentCount = technologyDocData['InCorrectCount'];
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
            }
        } catch {
            console.log("^-^")
        }
    }


    const fetchQuestionExplanation = async (questionID: string): Promise<string | undefined> => {
        try {
            console.log("fetchQuestionExplanation 関数が呼び出されました");
            const technologyQuery = query(collection(db, 'Technology'), where("問題ID", "==", questionID));
            const technologyQuerySnapshot = await getDocs(technologyQuery);
    
            if (!technologyQuerySnapshot.empty) { 
                const technologyDoc = technologyQuerySnapshot.docs[0];
                if (technologyDoc) {
                    const technologyDocData = technologyDoc.data();
    
                    // 解説が存在するか確認
                    if ("解説" in technologyDocData) {
                        // 解説が存在する場合
                        const explanations = Array.isArray(technologyDocData['解説']) ? technologyDocData['解説'] : [technologyDocData['解説']];
                        console.log("解説が存在します:", technologyDocData['解説']);
                        return explanations.join('\n');
                    } else {
                        // 解説が存在しない場合
                        console.log("解説が存在しません");
                        return undefined;
                    }
                }
            } else {
                console.error("指定された問題IDに対応するTechnologyドキュメントが見つかりませんでした");
                return undefined;
            }
        } catch (error) {
            console.error("問題の解説の取得に失敗:", error);
            return undefined;
        }
        // すべてのコードパスで値を返すようにするために、最後に undefined を返す
        return undefined;
    };

    const [explanations, setExplanations] = useState<string[]>([]);

    const handleAnswerButtonClick = async (isCorrect: any, questionID: any) => {
        setSelectedQuestionIDs((prevIDs) => {
            const newIDs = [...prevIDs, questionID];
            console.log(newIDs);
            return newIDs;
        });

        // 現在の質問IDに対する解説を取得
        const explanation = await fetchQuestionExplanation(questionID);

        // 解説をステートに保存
        setExplanations((prevExplanations) => [...prevExplanations, explanation || '']);

        if (isCorrect) {
            setScore((prevScore) => prevScore + 1);
            console.log("正解です");
            alert(`正解です😎\n解説: ${explanation || '解説がありません。'}`)
        } else {
            const incorrectQuestionId = questionID;
            addIncorrectQuestion(incorrectQuestionId);
            console.log("不正解です");
            alert(`不正解です😛\n解説: ${explanation || '解説がありません。'}`)
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
                                            {/* 解説を表示 */}
                                            {explanations.length > 0 && (
                            <div className='Kaisetsu_Scroll'>
                                <h4>問題解説:</h4>
                                {explanations.map((explanation, index) => (
                                    <h6 key={index}>{explanation}</h6>
                                ))}
                            </div>
                        )}


                    <div className="border"></div>
                    <button onClick={handleSubmission} disabled={isSubmitted} className='Quiz_button3'>送信</button>
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