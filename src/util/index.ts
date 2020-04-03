// 生成消息id

const generateUid = () => {
    return String(new Date().getTime()) + Math.floor(Math.random() * 999 + 1);
};


// 时间格式
const generateTime = () => {
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const hourText = hour === 0 ? '00' : String(hour);
    const minuteText = minute < 10 ? '0' + minute : String(minute);
    return hourText + ':' + minuteText;
};

const getRandomColor=()=>{
    return '#' + (function (h) {
        return new Array(7 - h.length).join("0") + h
    })((Math.random() * 0x1000000 << 0).toString(16))
}
function rgbToHex(r:number,g:number,b:number) {
    console.log(r.toString(16));
    console.log(g.toString(16));
    console.log(b.toString(16));
    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}

export {generateUid,generateTime,getRandomColor,rgbToHex}
