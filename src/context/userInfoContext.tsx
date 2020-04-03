import React, {createContext, useReducer} from 'react';
import io from "socket.io-client"


// 定义用户信息上下文，和登录时给用户信息赋值的dispatch方法
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}
interface UserInfo {
    uid:string;
    userName:string;
    socket:any;
}
// 当一个客户端访问时就初始化一个用户信息，socket:io(url)跟服务器建立全双工的长连接
var port = normalizePort(process.env.PORT || '4000');
const url = "http://localhost:"+port;
const userInfo:UserInfo={
    uid:'',
    userName:'',
    socket:io(url),
}
interface Login{
    uid:string;
    userName:string;
}


const UserInfoContext = createContext(null);



function Reducer(state:UserInfo,action:Login):UserInfo {
    return {...state,...action};
}

const UserInfoContextProvider=(props)=> {
    const [userState, dispatch] = useReducer(Reducer, userInfo);
    return(
    <UserInfoContext.Provider value={{userState,dispatch}}>
        {props.children}
    </UserInfoContext.Provider>
    )
}
export {UserInfoContext,UserInfoContextProvider}

