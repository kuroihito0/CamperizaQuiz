import React from 'react';

const Answer = ({ handleAnswerButtonClick, questions, currentQuestion }) => {
    return (
        <>
            <h1>3択クイズ</h1>
            <h2><span>第{currentQuestion + 1}問</span><br></br>問題:{questions[currentQuestion].questionText}</h2>
            <ul>
                {
                    questions[currentQuestion].answerOptions.map((answerOption, key) => (
                        <li
                            key={key}//key、12行目にkey={key}がありますがReactではliタグを付けるときは他と被らない番号をつけないといけないためにあります。
                            onClick={() => handleAnswerButtonClick(answerOption.isCorrect)}>{answerOption.answerText}
                        </li>)
                    )
                }
            </ul>
        </>
    );
};

export default Answer;

//ここでいう「回答オプション」とは、クイズの各質問に対する選択肢や回答のことを指します。 

//１０行目　questions[currentQuestion].answerOptions:
//          現在のクイズの質問に関連する回答オプションの配列を参照します。questionsは質問のリストであり、currentQuestionは現在表示されている質問のインデックスです。 

// １０行目 .map((answerOption, key) =>：
//          answerOptions配列の各要素に対して、指定された関数を実行します。answerOptionは現在の回答オプションを表し、keyはループ内での要素の一意の識別子です。

// １１行目 <li key={key} onClick={() => handleAnswerButtonClick(answerOption.isCorrect)}>{answerOption.answerText}</li>：
//          回答オプションをリストアイテム（<li>要素）として表示します。key属性は一意の識別子として使用されます。クリックされたときにhandleAnswerButtonClick関数
//          が実行され、引数としてanswerOption.isCorrect（回答の正誤を示す真偽値）が渡されます。answerOption.answerTextは回答オプションのテキストを表示します。




// 具体的には、questionsという配列には複数の質問が含まれており、各質問は以下のような形式でオブジェクトとして表されています：
// {
//   questionText: "クイズの質問文",
//   answerOptions: [
//     { answerText: "回答オプション1", isCorrect: false },
//     { answerText: "回答オプション2", isCorrect: true },
//     // 他の回答オプション...
//   ]
// }
// answerOptionsプロパティは、各質問に対する回答オプションの配列を表します。各回答オプションはオブジェクトであり、answerTextプロパティには回答のテキストが、isCorrectプロパティにはその回答が正しいかどうかを示す真偽値が格納されます。