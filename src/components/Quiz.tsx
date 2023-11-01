import { useEffect, useState } from 'react';
import Answer from './Answer';
import {
    addDoc,
    collection,
    serverTimestamp,
    onSnapshot,
    query,
    where,
} from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import '../styles/Chat.css';

const Quiz = (props) => {
    const { room } = props;
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const messagesRef = collection(db, 'messages');

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(messagesRef, where('room', '==', room)),
            (snapshot) => {
                let updatedMessages = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const text = data['text'];
                    updatedMessages.push({ text, id: doc.id });
                });
                setMessages(updatedMessages);
            }
        );

        return () => unsubscribe();
    }, [room]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        await addDoc(messagesRef, {
            text: score.toString(),
            createdAt: serverTimestamp(),
            user: auth.currentUser?.displayName,
            room,
        });
        setNewMessage('');
    };

    const questions = [
        {
            questionText: 'あるコンピュータ上で，異なる命令形式をもつ別のコンピュータで実行できる目的プログラムを生成する言語処理プログラムはどれか。',
            answerOptions: [
                { answerText: 'エミュレータ', isCorrect: true },
                { answerText: 'クロスコンパイラ', isCorrect: false },
                { answerText: '最適化コンパイラ', isCorrect: false },
                { answerText: 'ジェネレータ', isCorrect: false },
            ],
        },
        {
            questionText: 'この難易度は？',
            answerOptions: [
                { answerText: 'なんだろうな', isCorrect: false },
                { answerText: ' カブ', isCorrect: false },
                { answerText: '鳥', isCorrect: true },
                { answerText: 'なんだろうな', isCorrect: false },
            ],
        },
        {
            questionText: 'おみそしるは？',
            answerOptions: [
                { answerText: 'なんだろうな', isCorrect: false },
                { answerText: 'たい焼き', isCorrect: true },
                { answerText: '🎈', isCorrect: false },
                { answerText: 'なんだろうな', isCorrect: false },
            ],
        },
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);

    const handleAnswerButtonClick = (isCorrect) => {
        if (isCorrect) {
            alert('正解です');
            setScore(score + 1);
        } else {
            alert('不正解です');
        }

        const nextQuestion = currentQuestion + 1;

        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setShowScore(true);
            props.getPointValue(score);
        }
    };

    return (
        <div className="App">
            {showScore ? (
                <p>
                    お疲れ様でした!
                    <br />
                    <span className="correct">3問中{score}問</span>正解です
                    <button onClick={handleSubmit}>送信</button>
                </p>
            ) : (
                <Answer
                    handleAnswerButtonClick={handleAnswerButtonClick}
                    questions={questions}
                    currentQuestion={currentQuestion}
                />
            )}
        </div>
    );
};

export default Quiz;
