import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="App">
            <ul>
                <li><Link to="/">ホーム</Link></li>
                <li><Link to="/Quiz">クイズ</Link></li>
                <li><Link to="/Importer">問題を追加</Link></li>
                <li><Link to="/WordHint">用語を覚えよう</Link></li>
            </ul>
        </div>
    );
}

export default Home;
