
import {canvasWidth,canvasHeight} from "../../container/ChatRoom";
import React, {useRef, useEffect, useContext, useState} from "react";
import {Shape,ShapeParameter,Rect,Arc,Line} from '../../moudle/shape'
import {EventType, PaintContext, PaintState} from "../../context/paintContext";
import {Tools} from "./ToolBar";
import {getRandomColor, rgbToHex} from "../../util";
import {UserInfoContext} from "../../context/userInfoContext";
// 定义一个初始化每个图形全部属性的方法
const initShowShapeParameter=(left:ShapeParameter,right:PaintState,x:number,y:number)=>{
    left.lineWidth = right.lineWidth;
    left.isFill = right.isFill;
    left.fillStyle = right.fillStyle;
    left.strokeStyle = right.strokeStyle;
    left.startX =x;
    left.startY = y;
}


// paintCnavas组件有两层canvas：paintCanvas：用于动态绘图和 hitCanvas：用于点击可以知道选择到图形
// 本来两层canvas要分开的，但是因为是重合的，hitcanvas因为是隐藏还有层次低，导致鼠标监听事件触发不了，所以放到一起，用同一个onmousedown事件
const PaintCanvas=()=> {
    // 获取canvasRef
    const paintRef = useRef(null);
    const hitRef = useRef(null);


    const {paintState,dispatch} = useContext(PaintContext);

    // 定义绘图中几个鼠标事件要共享的变量
    let paintContext:CanvasRenderingContext2D;
    let hitContext:CanvasRenderingContext2D;
    let canPaint:boolean = false;
    let canvasOffsetLeft:number = 0;
    let canvasOffsetTop:number = 0;
    let startX:number = 0;
    let startY:number = 0;
    let currentShowShape:Shape=null;
    let currentHitShape:Shape = null;

    useEffect(()=>{
        // 获取context
        paintContext = paintRef.current.getContext('2d');
        hitContext = hitRef.current.getContext('2d');
        const pos = paintRef.current.getBoundingClientRect();
        canvasOffsetTop = pos.top;
        canvasOffsetLeft = pos.left;

        // hitcanvas 显示
        hitContext.clearRect(0,0,canvasWidth,canvasHeight);
        paintState.hitShapeElements.foreach((key:string,v)=>{
            v.draw(hitContext)
        })

    })

    const onmousedown=(event:React.MouseEvent<HTMLCanvasElement>)=>{
        switch (paintState.shape) {
            case Tools.choose:
                break;
            case Tools.erase:
                // console.log('erase')
                const x = event.clientX- canvasOffsetLeft;
                const y = event.clientY - canvasOffsetTop;
                if (hitContext) {
                    const p = hitContext.getImageData(x, y, 1, 1).data;
                    // console.log(p)
                    if (p[3] !== 0) {
                        // opacity: 0; filter:Alpha(opacity=0)
                        // visibility: 'hidden'
                        const key = rgbToHex(p[0], p[1], p[2]);
                       // console.log(key)
                        dispatch({
                            type: EventType.delShapeEle,
                            complex: {key: key,}
                        })
                    }
                }
                break;
            default:
                startX = event.clientX - canvasOffsetLeft;
                startY = event.clientY - canvasOffsetTop;
                canPaint = true;
                break;
        }
    }
   const onmousemove=(event:React.MouseEvent<HTMLCanvasElement>)=>{
        if(canPaint&&paintContext){
            const moveX = event.clientX;
            const moveY = event.clientY;
            const showShapeParameter = new ShapeParameter();
            const hitShapeParameter = new ShapeParameter();
            initShowShapeParameter(showShapeParameter,paintState,startX,startY);
            initShowShapeParameter(hitShapeParameter,paintState,startX,startY);
            hitShapeParameter.isFill = true;
            switch (paintState.shape) {
                case Tools.rect:
                    paintContext.clearRect(0,0,canvasWidth,canvasHeight);
                    const width = moveX - showShapeParameter.startX - canvasOffsetLeft;
                    const height = moveY - showShapeParameter.startY - canvasOffsetTop;
                    const myRect = new Rect( showShapeParameter,width, height);
                    const hitRect = new Rect(hitShapeParameter,width,height);
                    currentShowShape = myRect;
                    currentHitShape = hitRect;
                    myRect.draw(paintContext);
                    break;
                case Tools.arc:
                    paintContext.clearRect(0,0,canvasWidth,canvasHeight);
                    const arcEndX = moveX - canvasOffsetLeft;
                    const arcEndY = moveY - canvasOffsetTop;
                    const myArc = new Arc(showShapeParameter,arcEndX,arcEndY);
                    const hitArc = new Arc(hitShapeParameter,arcEndX,arcEndY);
                    currentShowShape = myArc;
                    currentHitShape = hitArc;
                    myArc.draw(paintContext);
                    break;
                case Tools.line:
                    paintContext.clearRect(0,0,canvasWidth,canvasHeight);
                    const endX = moveX - canvasOffsetLeft;
                    const endY = moveY - canvasOffsetTop;
                    const myLine = new Line(showShapeParameter,endX,endY);
                    const hitLine = new Line(hitShapeParameter,endX,endY);
                    hitLine.shapeParameter.lineWidth = hitLine.shapeParameter.lineWidth +10;// 设置这个是为了扩大点击删除线条的范围
                    currentShowShape = myLine;
                    currentHitShape = hitLine;
                    myLine.draw(paintContext);
                    break;

                case Tools.text:break;

            }
        }
    }
   const onmouseup=()=>{
        if(paintState.shape !== Tools.erase&&currentShowShape) {
            canPaint = false;
            if (paintContext&&currentShowShape) {
                paintContext.clearRect(0, 0, canvasWidth, canvasHeight);
                const key = getRandomColor();
                currentHitShape.shapeParameter.fillStyle = key;
               // console.log('增加')
                dispatch({
                    type:EventType.addShapeEle,
                    complex:{
                        key:key,
                        showShape:currentShowShape,
                        hitShape:currentHitShape,
                    }
                })
                currentShowShape = null;
            }
        }
    }
    return(
        <div>
            <canvas
                ref={paintRef}
                style= {{ position:'absolute',zIndex:2,border: '1px solid black'}}
                width={canvasWidth} height={canvasHeight}
                onMouseDown={(e)=>onmousedown(e)}
                onMouseMove={(e)=>onmousemove(e)}
                onMouseUp={()=>onmouseup()}
            />
            <canvas
                ref={hitRef}
                style={{position:'absolute',zIndex:0, visibility: 'hidden',border: '1px solid black'}}
                width={canvasWidth} height={canvasHeight}
            />
        </div>
    )
}
//
// // 所有动态绘图逻辑都在此组件内
// class PaintCanvas1 extends React.Component<any,Readonly<{tool:number,paintShape:Shape|null,hitShape:Shape|null}>> {
//     // 三层画布，current绘制当前图案，my保存已经画好的，hit用于橡皮擦除选择
//     private paintRef: React.RefObject<HTMLCanvasElement>;
//     private paintcanvas:HTMLCanvasElement | null;
//     private paintcontext:CanvasRenderingContext2D|null;
//     private currentShape:Shape|null;
//     private currentHitShape:Shape|null;
//     private canvasOffsetLeft:number;
//     private canvasOffsetTop:number;
//     private canPaint:boolean;
//     private chirld:MyCanvas|null;
//     constructor(props: Readonly<{}>) {
//         super(props);
//         this.paintRef = React.createRef();
//         this.paintcanvas = null;
//         this.paintcontext = null;
//         this.currentShape = null;
//         this.currentHitShape = null;
//         this.canvasOffsetTop = 0;
//         this.canvasOffsetLeft =0;
//         this.canPaint = false;
//         this.chirld = null;
//         this.state={
//             tool:Tools.choose,
//             paintShape:null,
//             hitShape:null,
//         }
//     }
//     setTools(i:number){
//         this.setState({
//             tool:i,
//             paintShape:null,
//         })
//     }
//     onRef=(ref:MyCanvas)=>{
//         this.chirld = ref;
//     }
//
//     componentDidMount(): void {
//         this.paintcanvas = this.paintRef.current;
//         if(this.paintcanvas) {
//             const pos = this.paintcanvas.getBoundingClientRect();
//             this.canvasOffsetTop = pos.top;
//             this.canvasOffsetLeft = pos.left;
//             this.paintcontext = this.paintcanvas.getContext('2d')
//         }
//
//     }
//
//     onmousedown(event:React.MouseEvent<HTMLCanvasElement>){
//         const e = event||window.event;
//         switch (this.state.tool) {
//
//             case Tools.choose:
//                 break;
//             case Tools.erase:
//                 myShapeParameter.startX = e.clientX - this.canvasOffsetLeft;
//                 myShapeParameter.startY = e.clientY - this.canvasOffsetTop;
//                 if(this.chirld) {
//                     this.chirld.erase(myShapeParameter.startX,myShapeParameter.startY);
//                 }
//                 break;
//             default:
//                 myShapeParameter.startX = e.clientX - this.canvasOffsetLeft;
//                 myShapeParameter.startY = e.clientY - this.canvasOffsetTop;
//                 this.canPaint = true;
//                 break;
//         }
//
//
//     }
//
//
//     onmousemove(event:React.MouseEvent<HTMLCanvasElement>){
//         if(this.canPaint&&this.paintcontext){
//             const e = event||window.event;
//             const moveX = e.clientX;
//             const moveY = e.clientY;
//             const currentShapeParameter = new ShapeParameter();
//             const currentHitShapeParameter = new ShapeParameter();
//             equalShapeParameter(currentShapeParameter,myShapeParameter);
//             equalShapeParameter(currentHitShapeParameter,myShapeParameter);
//             switch (this.state.tool) {
//                 case Tools.rect:
//                     this.paintcontext.clearRect(0,0,1200,593);
//                     const width = moveX - myShapeParameter.startX - this.canvasOffsetLeft;
//                     const height = moveY - myShapeParameter.startY - this.canvasOffsetTop;
//                     const myRect = new Rect( currentShapeParameter,width, height);
//                     const hitRect = new Rect(currentHitShapeParameter,width,height);
//                     this.currentShape = myRect;
//                     this.currentHitShape = hitRect;
//                     myRect.draw(this.paintcontext);
//                     break;
//                 case Tools.arc:
//                     this.paintcontext.clearRect(0,0,1200,593);
//                     const arcEndX = moveX - this.canvasOffsetLeft;
//                     const arcEndY = moveY - this.canvasOffsetTop;
//                     const myArc = new Arc(currentShapeParameter,arcEndX,arcEndY);
//                     const hitArc = new Arc(currentHitShapeParameter,arcEndX,arcEndY);
//                     this.currentShape = myArc;
//                     this.currentHitShape = hitArc;
//                     myArc.draw(this.paintcontext);
//                     break;
//                 case Tools.line:
//                     this.paintcontext.clearRect(0,0,1200,593);
//                     const endX = moveX - this.canvasOffsetLeft;
//                     const endY = moveY - this.canvasOffsetTop;
//                     const myLine = new Line(currentShapeParameter,endX,endY);
//                     const hitLine = new Line(currentHitShapeParameter,endX,endY);
//                     hitLine.shapeParameter.lineWidth = hitLine.shapeParameter.lineWidth +10;// 设置这个是为了扩大点击删除线条的范围
//                     this.currentShape = myLine;
//                     this.currentHitShape = hitLine;
//                     myLine.draw(this.paintcontext);
//                     break;
//
//                 case Tools.text:break;
//
//             }
//         }
//     }
//     onmouseup(){
//         if(this.state.tool !== Tools.erase&&this.currentShape) {
//             this.canPaint = false;
//             if (this.currentShape && this.paintcontext) {
//                 this.paintcontext.clearRect(0, 0, 1200, 593);
//                 this.setState({
//                     paintShape: this.currentShape,
//                     hitShape: this.currentHitShape,
//                 })
//                 this.currentShape = null;
//             }
//
//         }
//
//     }
//
//     render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
//         return (
//             <div >
//                 <div style={{height:593}}>
//                     <canvas
//                         ref={this.paintRef}
//                         style= {{ position:'absolute',zIndex:2, border: '1px solid black'}}
//                         width="1200" height="593"
//                         onMouseDown={(e)=>this.onmousedown(e)}
//                         onMouseMove={(e)=>this.onmousemove(e)}
//                         onMouseUp={()=>this.onmouseup()}
//                     />
//                     <MyCanvas value = {this.state.paintShape} hitValue={this.state.hitShape} onRef={this.onRef}></MyCanvas>
//                 </div>
//                 <ToolBar onClick={(i:number)=>this.setTools(i)}></ToolBar>
//             </div>
//
//         )
//
//     }
// }

export default PaintCanvas;