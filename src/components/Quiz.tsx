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
    const usersCollectionRef = collection(db, 'users');

    
    useEffect(() => {
        const [ users,setUsers ] = useState([]);

        useEffect(() => {
            const userCollectionRef = collection(db,"users");
            console.log(userCollectionRef);
        },[]);
        
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


        const buttonQuestion = () =>{
            alert("clicked");
        }

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
            PointHide(nextQuestion);
        } else {
            setShowScore(true);
            props.getPointValue(score);
            PointHide(nextQuestion);
        }
    };

    const PointHide = (nextQuestion) =>{
        if(nextQuestion>=1){
            console.log("hey");
            return(
                <form onSubmit={handleSubmit} className="new-message-form">
                <input
                    className="new-message-input"
                    onChange={handleSubmit}
                    value={score}
                />
                <button type="submit" className="send-button">
                    送信
                </button>
            </form>
            )

        }
    }

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
            <div className="chat-app">
                {messages.map((message) => (
                    <p key={message.id}>
                        <p>{message.createdAt} </p>
                    </p>
                ))}
            </div>
        </div>
    );
};

export default Quiz;
