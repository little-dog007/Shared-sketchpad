import {ShapeParameter} from "./ShapeParameter";

export class Shape{
    public type:number;
    // public context:CanvasRenderingContext2D;
    public shapeParameter:ShapeParameter;
    constructor(shapeParameter:ShapeParameter,type:number) {
        this.type =type;
        this.shapeParameter = shapeParameter;

    }
    // 准备绘制属性
    public prepareStyle(context:CanvasRenderingContext2D){}
    // 绘制前准备参数
    public setPro(){}

    // 调用draw进行绘制
    public draw(context:CanvasRenderingContext2D|null){}
}

