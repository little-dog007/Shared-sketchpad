import React, {useContext, useEffect, useRef} from "react";
import {PaintContext} from "../../context/paintContext";
import {canvasWidth,canvasHeight} from "../../container/ChatRoom";
import {UserInfoContext} from "../../context/userInfoContext";

const ShowCanvas = ()=>{
    //console.log("showCanvas 被渲染")
    const showRef = useRef(null);
    const {paintState} = useContext(PaintContext)

    // userState 需要用到socket
    const {userState} = useContext(UserInfoContext);
    useEffect(()=>{
        const showContext = showRef.current.getContext('2d');
        showContext.clearRect(0,0,canvasWidth,canvasHeight);
        paintState.showShapeElements.foreach((key:string,v)=>{
            v.draw(showContext)
        })
        const url = showRef.current.toDataURL();
        // 每重新渲染一次就发送一次新的画图数据
        sendDraw(url);
    })
    const sendDraw=(url:string)=>{
        userState.socket.emit('sendDraw',{uid:userState.uid,url:url})
    }
    return(
                <canvas
                    ref={showRef}
                    style= {{ position:'absolute',zIndex:1, border: '1px solid black'}}
                    width={canvasWidth}  height={canvasHeight}
                />
)
}

export default ShowCanvas;