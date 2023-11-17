import React, { useState } from 'react';
import Papa from 'papaparse';
import { useDropzone } from 'react-dropzone';

interface CSVRow {
    [key: string]: string | undefined;
    }

    const App: React.FC = () => {
    const [jsonResult, setJsonResult] = useState<CSVRow[] | null>(null);

    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];

        // ファイル読み込み
        const fileText = await file.text();

        // CSVパース
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

    return (
        <div>
        <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <p>CSVファイルからJSONファイルへ変換</p>
        </div>

        {jsonResult && (
            <div>
            <h2>変換結果</h2>
            <pre>{JSON.stringify(jsonResult, null, 2)}</pre>
            </div>
        )}
        </div>
        );
};

export default App;
