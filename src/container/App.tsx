import React, {useContext} from 'react'
import {UserInfoContext} from "../context/userInfoContext";
import {ChatContextProvider} from "../context/chatContext";
import {ChatRoom }from './ChatRoom'
import './App.css'
import Login from "../components/Login";
import Enjoy from "../components/chatComponents/Enjoy";
import  Layout  from 'antd/es/layout';
import 'antd/es/layout/style/index.css'
import {PaintContextProvider} from "../context/paintContext";
import PaintCanvas from "../components/paintComponents/paintCanvas";
import ShowCanvas from "../components/paintComponents/ShowCanvas";
import {ToolBar} from "../components/paintComponents/ToolBar";
const { Sider,Header, Footer, Content } = Layout;
export default function App() {
    const {userState} = useContext(UserInfoContext);
    console.log(userState);
    if (userState.uid){
        return (
            <Layout style={{height: '100%',width:'100%'}}>
                <Content style={{width:'70%'}}>
                    <Layout style={{height: '100%',width:'100%'}}>
                        <PaintContextProvider>
                            <Header style={{background: "white"}}><ToolBar/></Header>
                            <Content style={{width: '100%', height: '100%',position:'relative'}}>
                                <PaintCanvas/>
                                <ShowCanvas/>
                            </Content>
                        </PaintContextProvider>
                    </Layout>
                </Content>
                <ChatContextProvider>
                     <ChatRoom/>
                    <Sider width={150} theme={"light"} collapsedWidth={100}>
                        <Enjoy/>
                    </Sider>
                </ChatContextProvider>
            </Layout>
        )
    }
    return(
        <Login/>
    )

}
// // react-scripts start

// <PaintContextProvider>
//     <div style={{position:'static',height:593,width:"auto"}} >
//         <PaintCanvas/>
//         <ShowCanvas/>
//     </div>
//     <ToolBar/>
// </PaintContextProvider>

{/*{userState.uid?(*/}
{/*    <div>*/}
{/*         <div className='paintArea'>*/}
{/*            <Paint/>*/}
{/*        </div>*/}
{/*        <div className='showArea'>*/}
{/*            <ChatContextProvider>*/}
{/*               <ChatRoom/>*/}
{/*            </ChatContextProvider>*/}
{/*        </div>*/}
{/*    </div>*/}
{/*    ):(*/}
{/*    <Login/>*/}
{/*    )}*/}

