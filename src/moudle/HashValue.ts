
export class HashValue<T> {
    public key:string;

    // @ts-ignore
    public value:T;
    public index: number ;

    constructor() {
        this.index = 0;
        this.key = '';

    }

}