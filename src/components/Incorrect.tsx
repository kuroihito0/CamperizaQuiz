import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

import { db } from '../firebase-config';
import '../styles/Incorrect.css';

const Incorrect = () => {
    const [incorrectQuestions, setIncorrectQuestions] = useState([]);
    const [technologyQuestionsData, setTechnologyQuestionsData] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchIncorrectQuestions = async () => {
            try {
                // InCorrect コレクションから "間違えたID" と count を取得し、count でソート
                const incorrectQuestionsSnapshot = await getDocs(
                    query(collection(db, 'InCorrect'), orderBy('count', 'desc'))
                );
                
                const incorrectQuestionsData = incorrectQuestionsSnapshot.docs.map((doc) => ({
                    incorrectQuestionId: doc.data().incorrectQuestionId,
                    count: doc.data().count,
                }));

                if (incorrectQuestionsData.length > 0) {
                    // サーバーサイドでのフィルタリング
                    const technologyQuestionsSnapshot = await getDocs(
                        query(collection(db, 'Technology'), where('問題ID', 'in', incorrectQuestionsData.map(d => d.incorrectQuestionId)))
                    );
                    
                    const technologyQuestionsData = technologyQuestionsSnapshot.docs.map((doc) => ({
                        questionText: doc.data().問題文,
                        questionCount: incorrectQuestionsData.find(d => d.incorrectQuestionId === doc.data().問題ID)?.count || 0,
                    }));
                    
                    setIncorrectQuestions(incorrectQuestionsData);
                    setTechnologyQuestionsData(technologyQuestionsData);
                } else {
                    console.error('取得した incorrectQuestionsData が空です。');
                }
            } catch (error) {
                console.error('データの取得に失敗:', error);
            }
        };

        // fetchIncorrectQuestions 関数を呼び出し
        fetchIncorrectQuestions();
    }, [count]); // count が変更されたときに再実行されるように

    return (
        <div className='body'>
            {/* 取得した incorrectQuestions を使って表示や処理を行う */}
            {technologyQuestionsData.map((question, index) => (
                <p key={index}>
                    <h2>問題文: {question.questionText}</h2><h3>皆が間違えた回数: {question.questionCount}</h3> 
                </p>
            ))}
        </div>
    );
};

export default Incorrect;