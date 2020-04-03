import React, {createContext, useReducer} from 'react';
import {HashTable} from "../moudle/HashTable";
import {Shape} from "../moudle/shape/Shape";

// 定义聊天室的信息，以及改变这些信息的dispatch方法
interface ChatInfo {
    messages:Message[];
    onlineUsers:{[key:string]:string};
    othersDraw:{[key:string]:string}
    onlineCount:number;
}
const chatInfo:ChatInfo={
    messages:[],
    onlineUsers:{},
    othersDraw:{},
    onlineCount:0
}
// message分为四种：登出，登录，我的，其他人的，用于之后可以动态渲染时根据类型渲染出不同的效果
enum MesType{
    sysLoginMes ,
    sysLeaveMes,
    myMes ,
    othersMes ,
}
export interface Message{
    type:MesType;
    message:string;
    time:string;
    userName:string;
    uid:string;
}

interface UserMessage{
    message:Message;
}
interface DrawMesage{
    uid:string,
    url:string,
}

interface SystemMessage{
    onlineUsers:{};
    onlineCount:number;
    message:Message;
}

interface MesInfo extends UserMessage,SystemMessage,DrawMesage{}


const getUserMes=(info:MesInfo,state:ChatInfo)=>{
    return {messages:state.messages.concat(info.message)};
}

const getSysMes=(info:MesInfo,state:ChatInfo)=>{
    return {onlineUsers:info.onlineUsers,onlineCount:info.onlineCount,messages:state.messages.concat(info.message)}
}
const ChatContext = createContext(null);

// 声明修改dispatch的type
enum Type{
    Message,
    SystemMes,
    othersDraw
}
interface ActionType {
    type:Type;
    shouldUpdateInfo:MesInfo;
}

function Reducer(state:ChatInfo,action:ActionType):ChatInfo {
        console.log("ChatReducer 被调用")
        switch(action.type) {
            case Type.SystemMes:
                console.log("sys")
                return {...state, ...getSysMes(action.shouldUpdateInfo, state)}
                break;
            case Type.Message:
                console.log("Mes")
                return {...state, ...getUserMes(action.shouldUpdateInfo, state)};
            case Type.othersDraw:
                state.othersDraw[action.shouldUpdateInfo.uid] = action.shouldUpdateInfo.url;
                console.log(state)
                return  state;
            default:
                break;
        }
}

const ChatContextProvider=(props)=>{
    const [chatState,dispatch] = useReducer(Reducer,chatInfo);
    return(
        <ChatContext.Provider value={{chatState,dispatch}}>
            {props.children}
        </ChatContext.Provider>
    )
}

export {ChatContext,ChatContextProvider,Type,MesType}

