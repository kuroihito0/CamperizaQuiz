// src/components/Home.tsx
import {
    collection,
    doc,
    writeBatch,
} from 'firebase/firestore';
import { useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { db} from '../firebase-config'; // Firebaseの初期化済みインスタンスをインポート
import download from "../img/download.png";
import "../styles/importer.css"

interface CSVRow {
    [key: string]: string | undefined;
}

function Import() {
    const [userDefinedCollectionName, setUserDefinedCollectionName] = useState<string>('');
    const [isImported, setIsImported] = useState<boolean>(false);

const onDrop = async (acceptedFiles: File[]) => {
    // acceptedFiles 配列が空の場合は処理をスキップ
    if (acceptedFiles.length === 0) {
        console.error('ファイルが選択されていません。');
        return;
    }

    const file:any = acceptedFiles[0];
    const fileText = await file.text();

    Papa.parse<CSVRow>(fileText, {
        header: true,
        dynamicTyping: true,
        complete: (results: any) => {
            // Firestoreにデータを追加
            addDataToFirestore(results.data);
            setIsImported(true);
        },
        error: (error: any) => {
            console.error('CSV parsing error:', error.message);
        },
    });
};

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const addDataToFirestore = async (data: CSVRow[]) => {
        try {

            if (!userDefinedCollectionName) {
                console.error('コレクション名が指定されていません。');
                return;
            }

            const collectionRef = collection(db,userDefinedCollectionName);

            const batch = writeBatch(db)

            data.forEach((item) => {

                const docRef = doc(collectionRef);
                batch.set(docRef, item);
            });

            await batch.commit();
            console.log('Firestoreへのデータの追加に成功しました。');
                } catch (error) {
                    console.error('Firestoreへのデータ追加中にエラーが発生しました: ');
                }
    };

    const handleCollectionNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserDefinedCollectionName(e.target.value);
    };

    return (
        <div className="App">
            <ul>
                <li><Link to="/Home">ホーム</Link></li>
            </ul>
            <div className='importer_download'>
                <img src={download} alt='aaa' width={150} height={150}/>
            </div>
            <div className='importer_collection'>
                <label>
                    コレクション名：
                    <input
                        type="text"
                        value={userDefinedCollectionName}
                        onChange={handleCollectionNameChange}
                    />
                </label>
            </div>

            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <button className='importer_button'>インポート</button>
            </div>

            {isImported && (
                <div>
                    <p>Firestoreにデータがインポートされました。</p>
                </div>
            )}
        </div>
    );
}

export default Import;