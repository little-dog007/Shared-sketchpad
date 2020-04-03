import React, {useContext, useState} from 'react'
import {UserInfoContext} from "../../context/userInfoContext";
import {generateTime} from "../../util";

function ChatInput() {
    // console.log("chatInput update")
    const {userState} = useContext(UserInfoContext);
    const [mesState,setmesState] = useState('');
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setmesState(e.target.value);
    }
    const handleClick=(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        sendMessage();
    }
    const handleKeyPress=(e:React.KeyboardEvent<HTMLInputElement>):boolean=>{
        if (e.key === 'Enter'){
            sendMessage()
        }
        return false;
    }

    const sendMessage=():boolean=>{
        // 发送逻辑是 点击发送后组合成一个obj对象发送给服务器，服务器再发送给所有客户端
        // 客户端收到信息之后比较uid是否是自己发送的
        // 若是则不理睬
        // 不是加上一个type类型，放在messages数组里面
        if(mesState){
            const socket = userState.socket;
            // 发送给服务端的obj
            const obj={
                uid :userState.uid,
                userName:userState.userName,
                message:mesState,
                time:generateTime(),
            }
            socket.emit('message',obj);
            setmesState('');
        }
        return false;
    }

    return(
        <div>
            <input type="text" maxLength={140}
                   placeholder="按回车提交"
                   value={mesState}
                   onKeyPress={(e)=>{handleKeyPress(e)}}
                   onChange={(e)=>{handleChange(e)}}
            />
            <button
                type="button"
                onClick={(e)=>{handleClick(e)}}
            >
                    提交
            </button>
        </div>
    )
}

export default ChatInput