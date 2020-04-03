import React, {createContext, useReducer} from "react";
import {HashTable} from "../moudle/HashTable";
import {Shape} from "../moudle/shape/Shape";
import {Tools} from "../components/paintComponents/ToolBar";


const PaintContext = createContext(null)

export interface PaintState {
    shape:Tools;
    isFill:boolean;
    fillStyle:string;
    strokeStyle:string;
    lineWidth:number;
    showShapeElements:HashTable<Shape>;
    hitShapeElements:HashTable<Shape>;
}

const globalState:PaintState={
    shape:Tools.choose,
    isFill:false,
    fillStyle:'black',
    strokeStyle:'black',
    lineWidth:1,
    showShapeElements:new HashTable<Shape>(),
    hitShapeElements:new HashTable<Shape>(),
}


interface ShapeEvent{
    shape:number;
}
interface addShapeEleEvent{
    key:string
    showShape:Shape;
    hitShape:Shape;
}
interface delShapeEleEvent{
    key:string;
}
interface ComplexEvent extends addShapeEleEvent,ShapeEvent,delShapeEleEvent{}
const getNewShape=(info:ComplexEvent)=>{
    return {shape:info.shape}
}
const addEle =(addShape:ComplexEvent,state:PaintState)=>{
    //const key = getRandomColor();

    //addShape.hitShape.shapeParameter.fillStyle = key;
    // console.log(addShape.hitShape.shapeParameter.fillStyle)
    // console.log(key)
    // console.log(addShape)
    return({
        showShapeElements:state.showShapeElements.set(addShape.key, addShape.showShape),
        hitShapeElements:state.hitShapeElements.set(addShape.key,addShape.hitShape),
    })
}
const delEle=(delShape:ComplexEvent,state:PaintState)=>{
    return({
        showShapeElements:state.showShapeElements.del(delShape.key),
        hitShapeElements:state.hitShapeElements.del(delShape.key),
    })
}

export enum EventType{
    changeShape,
    changeStyle,
    addShapeEle,
    delShapeEle,
}
interface changeState {
    type:EventType;
    complex:ComplexEvent;
}

const Reducer =(state:PaintState,currentState:changeState)=>{
    console.log('被调用')
    switch (currentState.type) {
        case EventType.changeShape:
            return {...state,...getNewShape(currentState.complex)};
            break;
        case EventType.changeStyle:
            // 需要增加改变颜色等
            return state;
            break;
        case EventType.addShapeEle:
            console.log("add")
            console.log(currentState)
            return {...state,...addEle(currentState.complex,state)};
            break;
        case EventType.delShapeEle:
            return {...state,...delEle(currentState.complex,state)};
            break;
        default:
            console.log("paint Context Reduce 函数有defaul类型事件")
            return state;
    }
}

const PaintContextProvider=(props)=>{
    const [paintState,dispatch] = useReducer(Reducer,globalState);
    return(
        <PaintContext.Provider value={{paintState,dispatch}}>
            {props.children}
        </PaintContext.Provider>
    )
}

export {PaintContext,PaintContextProvider}