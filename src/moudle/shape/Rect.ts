import {ShapeParameter} from "./ShapeParameter";
import {Shape} from "./Shape";
import {Tools} from "../../components/paintComponents/ToolBar";

export class Rect extends Shape{
    public width:number;
    public height:number;
    constructor(shapeParameter:ShapeParameter,width:number,height:number) {
        super(shapeParameter,Tools.rect);
        this.width = width;
        this.height = height;
    }
    public prepareStyle(context: CanvasRenderingContext2D) {
        super.prepareStyle(context);
        context.fillStyle = this.shapeParameter.fillStyle;
        context.lineWidth = this.shapeParameter.lineWidth;
    }

    public draw(context: CanvasRenderingContext2D|null) {
        if (context) {
            context.save();
            this.prepareStyle(context)
            if (this.shapeParameter.isFill === true) {
                context.fillRect(this.shapeParameter.startX, this.shapeParameter.startY, this.width, this.height);
            } else {
                context.strokeRect(this.shapeParameter.startX, this.shapeParameter.startY, this.width, this.height);
            }
            context.restore()
        }
    }

}