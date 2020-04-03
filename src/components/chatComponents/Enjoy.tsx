import React, {useContext, useEffect, useRef, useState} from "react";
import {ChatContext} from "../../context/chatContext";
import {UserInfoContext} from "../../context/userInfoContext";

import List from 'antd/es/list'
import 'antd/es/list/style/index.css'
import Drawer from 'antd/es/drawer'
import 'antd/es/drawer/style/index.css'

const Enjoy=()=>{
    const [open,setOpen] = useState(false);

    const {chatState} = useContext(ChatContext);
    const {userState} = useContext(UserInfoContext);
    const [index,setIndex] = useState(userState.uid);
    let onlineUsers:Array<{key:string,name:string}>=[];

    for(let key  in chatState.onlineUsers){
        onlineUsers=onlineUsers.concat({key:key,name:chatState.onlineUsers[key]})
    }
    const showDrawer = (id:string)=>{
        setOpen(true);
        setIndex(id);
    }
    const onClose=()=>{
        setOpen(false);

    }
    return(
        <div>
            <div>
                <List
                    dataSource={onlineUsers}
                    bordered
                    renderItem={item => (
                        <List.Item
                            key={item.key}
                            actions={[
                                <a onClick={()=>showDrawer(item.key)} key={`a-${item.key}`}>
                                    查看绘图
                                </a>,
                            ]}
                        >
                            <List.Item.Meta
                                title={item.name}
                                description="详细消息 "
                            />
                        </List.Item>
                    )}
                />
                <Drawer
                    width={640}
                    placement="right"
                    closable={false}
                    onClose={onClose}
                    visible={open}
                >

                    {chatState.othersDraw[index]?(
                        <img src={chatState.othersDraw[index]}></img>
                    ):(
                        <div>还没想好绘图</div>
                    )}

                </Drawer>
                </div>
        </div>
    )
}

export default Enjoy;