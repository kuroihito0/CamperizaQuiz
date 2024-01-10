import { useState, useEffect } from 'react';
import '../styles/Answer.css';
import { motion } from "framer-motion";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

// Fisher-Yatesアルゴリズムを使用して、配列をランダムにシャッフルする関数
const shuffleArray = (array: any) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const Answer = ({ handleAnswerButtonClick, questions, currentQuestion, getModaniData }: any) => {
    const [showResults, setShowResults] = useState(false);
    const [questionExplanations, setQuestionExplanations] = useState<string[]>([]);

    useEffect(() => {
        // コンポーネントがマウントされたときに1回だけ実行
        getMondai();
    }, []); // 空の依存配列を渡すことで初回のみ実行されます

    const getMondai = async () => {
        await getModaniData();
        setShowResults(true);
    };

    const handleExplanationFetch = async (questionID: string) => {
        // 問題IDに対応する解説を取得
        const explanation = await fetchQuestionExplanation(questionID);
        // 取得した解説を配列に追加
        setQuestionExplanations((prevExplanations) => [...prevExplanations, explanation]);
    };

    // ランダムに質問をシャッフル
    const shuffledQuestions = shuffleArray(questions);

    const fetchQuestionExplanation = async (questionID:any) => {
        try {
            const docRef = doc(db, 'Technology', questionID);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const explanation = docSnap.data()['explanation'];
                return explanation || '解説がありません'; // explanationが存在しない場合のデフォルトメッセージ
            } else {
                return '問題が見つかりません';
            }
        } catch (error) {
            console.error('解説の取得に失敗しました:', error);
        }
    };

    return (
        <div className="answer_body">
            <div className="answer_title_box">
                <div className="answer_title_box-body">
                    {showResults ? (
                        <div>
                            <h2 className="answer_title">Q.{currentQuestion + 1}</h2>
                            <p className="answer_box1 answer_question">{shuffledQuestions[currentQuestion].questionText}</p>
                            <ul className="">
                                {shuffledQuestions[currentQuestion].answerOptions.map((answerOption: any, key: any) => (
                                    <motion.li
                                        className="answer_question2 answer_box2 answer_btn-border"
                                        whileHover={{
                                            scale: 1.1,
                                            transition: { duration: 1 },
                                        }}
                                        whileTap={{ scale: 0.9 }}
                                        key={key}
                                        onClick={() => {
                                            handleAnswerButtonClick(answerOption.isCorrect, shuffledQuestions[currentQuestion].questionID);
                                            handleExplanationFetch(shuffledQuestions[currentQuestion].questionID);
                                        }}
                                    >
                                        {answerOption.answerText}
                                    </motion.li>
                                ))}
                            </ul>
                            {/* 解説が存在する場合に表示 */}
                            {questionExplanations.length > 0 && (
                                <div>
                                    <ul>
                                        {questionExplanations.map((explanation, index) => (
                                            <li key={index}>{explanation}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Answer;