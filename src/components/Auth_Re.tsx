import {auth,provider} from "../firebase-config";
import {signInWithPopup} from "firebase/auth";
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
    return <div className='Home_button' id="Home_button5">
    <button onClick={signInWithGoogle}>ログイン</button>
</div>
}