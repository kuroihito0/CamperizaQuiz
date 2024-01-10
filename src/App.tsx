import './App.css'
import { Auth } from "./components/Auth";
import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Route, Routes,Link } from 'react-router-dom';

import Cookies from "universal-cookie";
const cookies = new Cookies();
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Title from "./components/title";
import Start from "./components/start";
import Incorrect from './components/Incorrect';
import Importer from './components/Importer'
import WordHint from './components/WordHint';




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
    <Route path="/" element={<Title/>}/>
    <Route path="/Quiz" element={<Quiz />}></Route>
    <Route path="/Home" element={<Home />}></Route>
    <Route path='/start' element={<Start />}></Route>
    <Route path='/Incorrect' element={<Incorrect/>}></Route>
    <Route path='/Importer' element={<Importer />}></Route>
    <Route path='/WordHint' element={<WordHint />}></Route>
</Routes>
  );

}



export default App