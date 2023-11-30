import React, { useState, useEffect } from 'react';
import '../styles/answer.css';
import AnimatedComponent from './AnimatedComponent';

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
        <div className='body'>
            <div className="title_box">
            </div>
            {showResults ? (
                <div>
                    {/* 結果を表示するコンポーネントや要素 */}
                    <p>Q.{currentQuestion + 1}</p>
                    <p>{shuffledQuestions[currentQuestion].questionText}</p>
                    <ul>
                        {shuffledQuestions[currentQuestion].answerOptions.map((answerOption, key) => (
                            <li
                                key={key}
                                onClick={() => handleAnswerButtonClick(answerOption.isCorrect)}
                            >
                                {answerOption.answerText}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Answer;