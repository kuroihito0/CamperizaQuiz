import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import "../styles/Chat.css"

const Chat = (props) => {
    const { room } = props
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const messagesRef = collection(db, "messages");

    useEffect(() => {
        const queryMessages = query(messagesRef, where("room", "==", room));
        const unscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id });
            });
            setMessages(messages);
        });
        return () => unscribe();
    },)



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage === "") return;

        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser?.displayName,
            room,
        });

        setNewMessage("")
    }
    return (
        <div className="chat-app">
            <div>{messages.map((message) => <h1 >{message.text}</h1>)}</div>
            <form onSubmit={handleSubmit} className="new-message-form">
                <input
                    className="new-message-input"
                    placeholder="メッセージを入力"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                />
                <button type="submit" className="send-button">送信</button>
            </form>
        </div>
    );
}
export default Chat;