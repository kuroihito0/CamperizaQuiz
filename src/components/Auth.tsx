import {auth,provider} from "../firebase-config";
import {signInWithPopup} from "firebase/auth";
import ipa from "../img/IPA.png";
import"../styles/Auth.css"
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const Auth = (props:any) =>{
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
    <img src={ipa} alt="aa" />
    <button className="Auth_btn Auth_btn-radius-gradient Auth_button" onClick={signInWithGoogle}>ログイン</button>
</div>
}