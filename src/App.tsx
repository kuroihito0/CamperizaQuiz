import './App.css'

import { Auth } from "./components/Auth";
import Cookies from "universal-cookie";
const cookies = new Cookies();

import  { useState} from "react";
import {  Route, Routes } from 'react-router-dom';

import Quiz from "./components/Quiz";
import Title from "./components/title";
import Start from "./components/start";
import Incorrect from './components/Incorrect';
import Import from './components/Importer';
import WordHint from './components/WordHint';
import Home from "./components/Home";




function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"))

  if (!isAuth) {
    return (
      <div style={{ margin: "2em" }}>
        <Auth setIsAuth={setIsAuth}/>
      </div>
    );
  }

  return (
    <Routes>
    <Route path="/" element={<Title />}/>
    <Route path='/Home' element={<Home/>}></Route>
    <Route path="/Quiz" element={<Quiz />}></Route>
    <Route path="/title" element={<Title />}></Route>
    <Route path='/start' element={<Start />}></Route>
    <Route path="/Importer" element={<Import />}/>
    <Route path="/WordHint" element={<WordHint />}/>
    <Route path='/Incorrect' element={<Incorrect/>}></Route>
</Routes>
  );

}



export default App