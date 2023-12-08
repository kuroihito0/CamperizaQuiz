import {auth,provider} from "../firebase-config";
import {signInWithPopup} from "firebase/auth";
import bouzu from "../img/doll.png";
import"../styles/Auth.css"
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const Auth = (props) =>{
    const {setIsAuth} = props;
    const signInWithGoogle = async () =>{
        try{
            const result = await signInWithPopup(auth , provider);
            cookies.set("auth-token",result.user.refreshToken);
            setIsAuth(true);
        }catch(err){
            console.error(err);
        }
    };

    //タイトル画面
    return <div className="auth">
        <img src={bouzu} alt="aa" />
        <h1>おいでやす</h1>
        <button className="btn btn-radius-gradient" onClick={signInWithGoogle}>B・A・K・A・S・U・R・V・I・V・O・R</button>
    </div>
}