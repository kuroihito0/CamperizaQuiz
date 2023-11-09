import './App.css'
import { Auth } from "./components/Auth";
import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Route, Routes,Link } from 'react-router-dom';

import Cookies from "universal-cookie";
const cookies = new Cookies();

import Home from "./components/Home";
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
    <Routes>
    <Route path="/" element={<Home />}/>
    <Route path="/Quiz" element={<Quiz />}/>
</Routes>
  );

}



export default App