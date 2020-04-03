
export class ShapeParameter {
    public lineWidth:number;
    public isFill:boolean;

    public fillStyle:string;
    public strokeStyle:string;
    public startX:number;
    public startY:number;
    constructor() {
        this.lineWidth =1;
        this.isFill = false;
        this.fillStyle = "#000000";
        this.strokeStyle = "#000000";
        this.startX =0;
        this.startY = 0;


    }
}
//相当于重载类的=运算符
export function equalShapeParameter(currentShapeParameter:ShapeParameter,myShapeParameter:ShapeParameter) {
    currentShapeParameter.lineWidth = myShapeParameter.lineWidth;
    currentShapeParameter.isFill = myShapeParameter.isFill;
    currentShapeParameter.fillStyle = myShapeParameter.fillStyle;
    currentShapeParameter.strokeStyle = myShapeParameter.strokeStyle;
    currentShapeParameter.startX = myShapeParameter.startX;
    currentShapeParameter.startY = myShapeParameter.startY;
}