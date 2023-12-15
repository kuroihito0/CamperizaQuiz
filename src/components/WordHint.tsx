import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { animateScroll as scroll, scroller } from 'react-scroll';
import '../styles/WordHint.css'

interface WordData {
    ID: number;
    単語: string | null;
    意味: string | null;
}

const scrollToTop = () => {
    // 'top' は、スクロール先の要素の名前（下で定義されている "top" と対応）
    scroller.scrollTo('top', {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
    });
};

function WordHint() {
    const [wordList, setWordList] = useState<WordData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, '用語の覚え方集'));
                const data: WordData[] = querySnapshot.docs
                    .filter((doc) => doc.data().意味 !== null)
                    .map((doc) => ({
                        ID: doc.data().ID,
                        単語: doc.data().単語,
                        意味: doc.data().意味,
                    }));
                console.log('Fetched Data:', data);
                setWordList(data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="App" style={{ maxWidth: '1300px', margin: '0 auto', overflowY: 'auto', height: '100vh' }}>
            <ul>
                <li>
                    <Link to="/">ホーム</Link>
                </li>
            </ul>

            <h2>用語一覧</h2>
            <ul>
                {wordList.map((word) => (
                    <li key={word.ID}>
                        <strong>{word.単語}</strong>
                        <br />
                        {word.意味 !== null && (
                            <>
                                {word.意味.split('。').map((sentence, index, array) => (
                                    <span key={index}>
                                        {sentence}
                                        {index < array.length - 1 && sentence.length > 0 && '。'}
                                        {index < array.length - 1 && sentence.length > 0 && <br />}
                                    </span>
                                ))}
                            </>
                        )}
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WordHint;