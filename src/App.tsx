import './App.css';
import { Auth } from "./components/Auth";
import React, { useState, useRef } from "react";
import Papa from 'papaparse';
import { useDropzone } from 'react-dropzone';

import Cookies from "universal-cookie";
const cookies = new Cookies();

import Quiz from "./components/Quiz";

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
    <div>
      {room ? (
        <Quiz room={room}/>
      ) : (
        <div>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <p>Drag & drop a CSV file here, or click to select one</p>
          </div>

          {jsonResult && (
            <div>
              <h2>JSON Result</h2>
              <pre>{JSON.stringify(jsonResult, null, 2)}</pre>
            </div>
          )}
          
          <div className="room">
            <label>Enter Room Name:</label>
            <input ref={roomInputRef}/>
            <button onClick={()=> {if(roomInputRef.current){setRoom(roomInputRef.current.value);}}}> Enter Chat</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
