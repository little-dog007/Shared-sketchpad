import {ShapeParameter} from "./ShapeParameter";
import {Shape} from "./Shape";
import {Tools} from "../../components/paintComponents/ToolBar";

export  class Line extends Shape{
    private endX:number;
    private endY:number;
    constructor(shapeParameter:ShapeParameter,endX:number,endY:number){
        super(shapeParameter,Tools.line);
        this.endX = endX;
        this.endY = endY;

    }
    public prepareStyle(context: CanvasRenderingContext2D) {
        super.prepareStyle(context);
        context.strokeStyle = this.shapeParameter.fillStyle;
        context.lineWidth = this.shapeParameter.lineWidth;
    }

    public draw(context: CanvasRenderingContext2D|null) {
        if (context) {
            this.prepareStyle(context)
            context.beginPath();
            context.moveTo(this.shapeParameter.startX,this.shapeParameter.startY);
            context.lineTo(this.endX,this.endY);
            context.closePath();
            context.stroke();

        }
    }

}