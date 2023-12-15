import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { db } from '../firebase-config';

const IncorrectQuestions = () => {
    const [incorrectQuestions, setIncorrectQuestions] = useState<any[]>([]);

    useEffect(() => {
        const fetchIncorrectQuestions = async () => {
            try {
                // InCorrectCount フィールドが存在するドキュメントのみを取得
                const technologyQuery = query(collection(db, 'Technology'), where('InCorrectCount', '>', 0));
                const technologySnapshot = await getDocs(technologyQuery);

                const incorrectQuestionsData = technologySnapshot.docs.map((doc) => ({
                    questionText: doc.data()['問題文'],
                    inCorrectCount: doc.data()['InCorrectCount'] || 0,
                }));

                console.log(incorrectQuestionsData)
                setIncorrectQuestions(incorrectQuestionsData);
            } catch (error) {
                console.error('データの取得に失敗:', error);
            }
        };

        // ページがロードされた時にデータを取得
        fetchIncorrectQuestions();
    }, []);

    return (
        <div className='body'>
            <h2>皆が間違えた問題</h2>
            <ul>
                {incorrectQuestions.map((question, index) => (
                    <li key={index}>
                        <strong>問題文:</strong> {question.questionText} <strong>皆が間違えた数:</strong> {question.inCorrectCount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default IncorrectQuestions;
