import './App.css'
import { Auth } from "./components/Auth";
import React, { useState, useRef } from "react";

import Cookies from "universal-cookie";
const cookies = new Cookies();

import Quiz from "./components/Quiz";


function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"))
  const [room, setRoom] = useState("")

  const roomInputRef = useRef<HTMLInputElement | null>(null); // roomInputRef の型を指定

  if (!isAuth) {
    return (
      <div style={{ margin: "2em" }}>
        <Auth setIsAuth={setIsAuth}/>
      </div>
    );
  }

  return (
    <div>
      {room ? (
        <Quiz room={room}/>

      ) : (
        <div className="room">
          <label>Enter Room Name:</label>
          <input ref={roomInputRef}/>
          <button onClick={()=> {if(roomInputRef.current){setRoom(roomInputRef.current.value);}}}> Enter Chat</button>
        </div>
      )}
    </div>
  );

}



export default App
