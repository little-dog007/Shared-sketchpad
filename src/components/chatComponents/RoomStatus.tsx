import React, {useContext} from 'react';
import {ChatContext} from "../../context/chatContext";

// userhtml 后期用于优化，展示一个用户列表，点击呈现画出的canvas

const RoomStatus = () => {
    console.log("RoomStatus update")
    const {chatState} = useContext(ChatContext)
    // console.log(chatState)
    return (
        <div className="room-status">
            已连接 在线人数: {chatState.onlineCount}, 在线列表: 待优化
        </div>
    );
};
export default RoomStatus;
