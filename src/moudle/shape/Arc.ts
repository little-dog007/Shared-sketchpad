import {ShapeParameter} from "./ShapeParameter";
import {Shape} from "./Shape";
import {Tools} from "../../components/paintComponents/ToolBar";

export class Arc extends Shape{
    private endX:number;
    private endY:number;
    constructor(shapeParameter:ShapeParameter,endX:number,endY:number){
        super(shapeParameter,Tools.arc);
        this.endX = endX;
        this.endY = endY;

    }
    public prepareStyle(context: CanvasRenderingContext2D) {
        super.prepareStyle(context);
        context.fillStyle = this.shapeParameter.fillStyle;
        context.lineWidth = this.shapeParameter.lineWidth;
    }

    public draw(context: CanvasRenderingContext2D|null) {
        if (context) {
            context.save()
            this.prepareStyle(context)
            context.beginPath();
            const x = this.shapeParameter.startX-this.endX;
            const y = this.shapeParameter.startY - this.endY;
            const r =Math.sqrt(x*x+y*y);
            context.arc(this.shapeParameter.startX,this.shapeParameter.startY,r,0,Math.PI*2,false)
            context.closePath();
            if(this.shapeParameter.isFill)
                    context.fill();
            else context.stroke();
            context.restore()

        }
    }

}
export default Arc;