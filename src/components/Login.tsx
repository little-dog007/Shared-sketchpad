import React, {useContext, useState} from 'react'
import {UserInfoContext} from "../context/userInfoContext";
import {generateTime, generateUid} from "../util";
import './Login.css';


// 登录组件
const Login = ()=>{
    //console.log("Login update")
    const {userState,dispatch} = useContext(UserInfoContext);
    const [mesState,setmesState] = useState('');
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setmesState(e.target.value);
    }
    const handleClick=(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        login();
    }
    const handleKeyPress=(e:React.KeyboardEvent<HTMLInputElement>):boolean=>{
        if (e.key === 'Enter'){
            login();
        }
        return false;
    }
    const login=()=>{
        const uid = generateUid();
        const user = {
            uid:uid,
            userName:"游客",
        }
        if(mesState) {
           user.userName = mesState;
        }
        userState.socket.emit('login',{...user,time:generateTime()});
        dispatch(user);
    }
    return(
        <div className="loginPlane">
            <h2>登录</h2>
            <input type="text" maxLength={140}
                   placeholder="输入用户名"
                   value={mesState}
                   onKeyPress={(e)=>{handleKeyPress(e)}}
                   onChange={(e)=>{handleChange(e)}}
            />
            <button
                type="button"
                onClick={(e)=>{handleClick(e)}}
            >
                登录
            </button>
        </div>


    )
}

export default Login;