import './App.css';
import { Auth } from "./components/Auth";
import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Route, Routes,Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Cookies from "universal-cookie";
const cookies = new Cookies();

import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Import from './components/importer';
import WordHint from './components/WordHint';

interface CSVRow {
  [key: string]: string | undefined;
}

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"))
  const [room, setRoom] = useState("")

  const roomInputRef = useRef<HTMLInputElement | null>(null);

  const [jsonResult, setJsonResult] = useState<CSVRow[] | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const fileText = await file.text();

    Papa.parse<CSVRow>(fileText, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        setJsonResult(results.data);
      },
      error: (error) => {
        console.error('CSV parsing error:', error.message);
      },
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
    <Route path="/Importer" element={<Import />}/>
    <Route path="/WordHint" element={<WordHint />}/>
</Routes>
  );
}



export default App
