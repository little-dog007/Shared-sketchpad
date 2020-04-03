import React, {useContext, useEffect, useState} from 'react';
import Messages from '../components/chatComponents/Messages';
import ChatInput from '../components/chatComponents/ChatInput';
import {ChatContext, ChatContextProvider, MesType, Type} from '../context/chatContext';
import RoomStatus from "../components/chatComponents/RoomStatus";
import Enjoy from "../components/chatComponents/Enjoy";
import {UserInfoContext} from "../context/userInfoContext";
import Layout from "antd/es/layout";
import 'antd/es/layout/style/index.css'
const { Sider,Header, Footer, Content } = Layout;

let canvasWidth = 1306;
const canvasHeight = 600;

const ChatRoom = ()=> {
    const {chatState,dispatch} = useContext(ChatContext);
    const {userState} = useContext(UserInfoContext)
    const [init,setInit] = useState(false);
    const [open,setOpen] = useState(true);
    console.log("chatRoom update")
    console.log(chatState)
    // 监听处理消息
    const hanldeListen=(eventType:string,obj)=>{
        switch (eventType) {
            case 'login':
                console.log("接受到login事件")

                const newMessage = {
                    type:MesType.sysLoginMes,
                    message:'',
                    time:obj.user.time,
                    userName:obj.user.userName,
                    uid:obj.user.uid,
                }
                dispatch({
                    type:Type.SystemMes,
                    shouldUpdateInfo:{
                        onlineUsers:obj.onlineUsers,
                        onlineCount:obj.onlineCount,
                        message:newMessage,
                    }});
                break;
            case 'out':
                const new_Message = {
                    type:MesType.sysLeaveMes,
                    message:'',
                    time:obj.user.time,
                    userName:obj.user.userName,
                    uid:obj.user.uid,
                }
                dispatch({
                    type:Type.SystemMes,
                    shouldUpdateInfo:{
                        onlineUsers:obj.onlineUsers,
                        onlineCount:obj.onlineCount,
                        message:new_Message,
                    }});
                break;
            case 'message':
                console.log("接受到message事件")
                const _newMessage ={
                    type:MesType.othersMes,
                    message:obj.message,
                    time:obj.time,
                    userName:obj.userName,
                    uid:obj.uid,
                }
                console.log(_newMessage)
                if(obj.uid === chatState.uid && obj.userName === chatState.userName){
                    _newMessage.type = MesType.myMes;
                }
                dispatch({
                    type:Type.Message,
                    shouldUpdateInfo:{
                        message:_newMessage,
                }})
                break;
            case 'sendDraw':
                dispatch({
                    type:Type.othersDraw,
                    shouldUpdateInfo:{
                        uid:obj.obj.uid,
                        url:obj.obj.url,
                    }
                })
                break;
            default:
                break;
        }

    }
    // 监听消息
    const listen = ()=>{
        console.log("--------------------------------")
        const {socket} = userState;
        console.log(socket)
        socket.on('login',(obj)=>{
            hanldeListen('login',obj);
        })
        socket.on('out',(obj)=>{
            hanldeListen('out',obj);
        })
        socket.on('message',(obj)=>{
            hanldeListen('message',obj);
        })
        socket.on('sendDraw',(obj)=>{
            hanldeListen('sendDraw',obj);
            console.log("听到sendDraw------------")
            console.log(obj)
        })

    }
    const isOpen=(flag:boolean)=>{
        setOpen(flag);
        canvasWidth = 986;
    }

    useEffect(()=>{
        if(!init){
            setInit(true);
            listen();
        }
    })
    return(
        <Sider
            collapsible={true}
            width={400}
            theme={'light'}
            reverseArrow={true}
            onCollapse={(collapsed)=>isOpen(collapsed)}
            defaultCollapsed={true}
            style={{border:'1px solid black'}}
        >
                {open?(
                    <div>点击箭头打开聊天</div>
                   ):(
                    <Layout style={{height: '100%'}}>
                        <Header style={{background: "white"}}><RoomStatus/></Header>
                        <Content><Messages/></Content>
                        <Footer><ChatInput/></Footer>
                    </Layout>
                )}
        </Sider>
    )
}

export  {ChatRoom,canvasWidth,canvasHeight};
