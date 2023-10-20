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
            questionText: '化け物は？',
            answerOptions: [
                { answerText: 'あ', isCorrect: true },
                { answerText: 'い', isCorrect: false },
                { answerText: 'なんだろうな', isCorrect: false },
            ],
        },
        {
            questionText: 'この難易度は？',
            answerOptions: [
                { answerText: 'なんだろうな', isCorrect: false },
                { answerText: ' カブ', isCorrect: false },
                { answerText: '鳥', isCorrect: true },
            ],
        },
        {
            questionText: 'おみそしるは？',
            answerOptions: [
                { answerText: 'なんだろうな', isCorrect: false },
                { answerText: 'たい焼き', isCorrect: true },
                { answerText: '🎈', isCorrect: false },
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
                </p>
            ) : (
                <Answer
                    handleAnswerButtonClick={handleAnswerButtonClick}
                    questions={questions}
                    currentQuestion={currentQuestion}
                />
            )}
            <div className="chat-app">
                {messages.map((message) => (
                    <p key={message.id}>{message.text}</p>
                ))}
                <form onSubmit={handleSubmit} className="new-message-form">
                    <input
                        className="new-message-input"
                        onChange={(e) => setScore(parseInt(e.target.value))}
                        value={score}
                    />
                    <button type="submit" className="send-button">
                        送信
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Quiz;