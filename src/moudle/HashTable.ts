
import {HashValue} from "./HashValue";

export class HashTable<T> {
    private items:{[key:string]:HashValue<T>};
    private itemList:T[];
    constructor() {
        this.items ={};
        this.itemList = [];
    }
    public forItem(callback:{(v:T):void}){
        let num=this.count()
        for(let i:number=0;i<num-1;i++){
            callback(this.itemList[i]);
        }
    }
    public set(key:string,value:T):HashTable<T>{
        console.log('set被执行')
        let vl = new HashValue<T>();
        vl.key = key;
        vl.value = value;
        let index = this.itemList.length;
        if(this.has(key)){
            index = this.items[key].index;
        }
        vl.index = index;
        this.itemList[index] = value;
        this.items[key] = vl;
        return this;
    }
    public del(key:string):HashTable<T>{
        if(this.has(key)){
            let index = this.items[key].index;
            if(index > -1){
                this.itemList.splice(index,1);
            }
            delete this.items[key];
            this.resetIndex();
        }
        return this;
    }
    public dellast(){
        let index = this.itemList.length-1;
        this.itemList.splice(index,1);
        this.foreach((k:string,v:T)=>{
            if(this.items[k].index === index){
                delete this.items[k];
            }
        })
    }
    public get(key:string):T|undefined{
        if(this.has(key)){
            return this.items[key].value;
        }
        return undefined;
    }
    public count(){
        return this.itemList.length;
    }
    public all(){
        return this.itemList;
    }
    public first(){
        return this.itemList[0];
    }
    public last(){
        return this.itemList[this.itemList.length-1];
    }
    public getByIndex(index:number):T{
        return this.itemList[index];
    }
    public indexOf(key:string){
        if(this.has(key)){
            return this.items[key].index;
        }
    }
    public insertAt(index:number,value:T,key:string){
        this.itemList.splice(index,0,value);
        let hashV = new HashValue<T>();
        hashV.index = index;
        hashV.key = key;
        hashV.value = value;
        this.items[key] = hashV;
        this.resetIndex();
    }
    public  has(key:string):boolean{
        return key in this.items;
    }
    private resetIndex():void{
        this.foreach((k: string | number,v:T)=>{
            let index = this.itemList.indexOf(v);
            this.items[k].index = index;
        })
    }

    public foreach(callback: { (k: string, v: T): void }){
        for(let key of Object.keys(this.items)){
            callback(key,this.items[key].value);
        }
    }

}