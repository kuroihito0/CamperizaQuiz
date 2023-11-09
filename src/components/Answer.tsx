import React from 'react';
import '../styles/answer.css';

const Answer = ({ handleAnswerButtonClick, questions, currentQuestion }) => {
    return (
        <div className='body'>
            <div className="title_box">
    <div className="title_box-body">
        <h1 className='title'>第{currentQuestion + 1}問</h1>
    </div>
</div>
            xx
            <ul className=''>
                {
                    questions[currentQuestion].answerOptions.map((answerOption, key) => (
                        <li className='question2 box2'
                            key={key}//key、12行目にkey={key}がありますがReactではliタグを付けるときは他と被らない番号をつけないといけないためにあります。
                            onClick={() => handleAnswerButtonClick(answerOption.isCorrect)}>{answerOption.answerText}
                        </li>)
                    )
                }
            </ul>
        </div>
    );
};

export default Answer;