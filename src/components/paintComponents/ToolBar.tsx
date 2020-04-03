import React, {useContext} from "react";
import {EventType, PaintContext} from "../../context/paintContext";

//维护请同时修改tool跟tools,与ToolBar组件中的return方法
const toolName:string[]=["选择","矩形","圆形","直线","文字","橡皮"]

enum Tools {
    choose,
    rect,
    arc,
    line,
    text,
    erase
}



function Button(props:Readonly<{value:number}>){
    //console.log("ToolBar 被渲染")
    const {dispatch} = useContext(PaintContext)
    const handleClick=(num:number)=>{
        dispatch({type:EventType.changeShape,complex:{shape:props.value}})
    }
    return(
        <button style={{zIndex:3}} className="tool" onClick={()=>{handleClick(props.value)}}>{toolName[props.value]}</button>
    )
}

const ToolBar=()=>{
   // console.log("ToolBar 被渲染")
    return (
        <div className="barButton">
            <Button value={Tools.choose} />
            <Button value={Tools.rect} />
            <Button value={Tools.arc} />
            <Button value={Tools.line} />
            <Button value={Tools.text} />
            <Button value={Tools.erase} />
        </div>
    );
}

export {ToolBar,Tools};