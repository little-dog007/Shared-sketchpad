import React, {useContext} from 'react';
import {Message, MesType} from "../../context/chatContext";
import {ChatContext} from "../../context/chatContext";


const SingalMessage = (props:Message) => {
    console.log("SingalMessage")
    switch (props.type) {
        case MesType.sysLoginMes:
            console.log(0)
            return (
                <div className="system-message">
                    {props.userName}&nbsp;进入了聊天室
                    <span className="time">&nbsp;{props.time}</span>
                </div>
            );
            break;
        case MesType.sysLeaveMes:
            console.log(1)
            return (
                <div className="system-message">
                    {props.userName}&nbsp;离开了聊天室  <span
                    className="time">&nbsp;{props.time}</span>
                </div>
            );
            break;
        case MesType.myMes:
            console.log(2)
            return (
                <div className="mine message">
                    <span>{props.userName}</span> {props.time}
                    <div>{props.message}</div>
                </div>
            )
        case MesType.othersMes:
            return (
                <div className="others message">
                    <span>{props.userName}</span> {props.time}
                    <div>{props.message}</div>
                </div>
            )
            break;
        default:
            // console.log(3)
            console.log('Message 没有渲染');
            return(<div></div>);
    }
}

function Messages() {
    // console.log("Message update")
    const {chatState} = useContext(ChatContext);
    return (
        <div className="Messages">
            {chatState.messages.map((message:Message)=>{
                // console.log(message);
                return(
                    <SingalMessage uid={message.uid} type={message.type} message={message.message} time={message.time} userName={message.userName}/>
                )})}
        </div>
    )
}

export default Messages;