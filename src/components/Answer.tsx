import React, { useState, useEffect } from 'react';
import '../styles/answer.css';
import { motion, useUnmountEffect } from "framer-motion";

// Fisher-Yatesアルゴリズムを使用して、配列をランダムにシャッフルする関数
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const Answer = ({ handleAnswerButtonClick, questions, currentQuestion, getModaniData }) => {
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        // コンポーネントがマウントされたときに1回だけ実行
        getMondai();
    }, []); // 空の依存配列を渡すことで初回のみ実行されます

    const getMondai = async () => {
        await getModaniData();
        setShowResults(true);
    };

    // ランダムに質問をシャッフル
    const shuffledQuestions = shuffleArray(questions);


    return (
        <div className='answer_body'>
            <div className="answer_title_box">
                <div className="answer_title_box-body">
                    </div>
                    {showResults ? (
                    <div>
                        <h2 className='answer_title'>Q.{currentQuestion + 1}</h2>
                        <p className='answer_box1 answer_question'>{shuffledQuestions[currentQuestion].questionText}</p>
                        <ul>
                            {shuffledQuestions[currentQuestion].answerOptions.map((answerOption, key) => (
                                    <motion.li className='answer_question2 answer_box2 answer_btn-border answer_mayuri'
                                        whileHover={{
                                            scale: 1.1,
                                            transition: { duration: 1 },
                                        }}
                                        whileTap={{ scale: 0.9 }}
                                        key={key}
                                        onClick={() => handleAnswerButtonClick(answerOption.isCorrect,shuffledQuestions[currentQuestion].questionID)}>
                                            {answerOption.answerText}
                                    </motion.li>))}
                        </ul>
                    </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
    );
};

export default Answer;