//MODELO


//modelado de los atributos de la clase
export class User{
    
    constructor(
        public _id: string,
        public name: string,
        public surname: string,
        public pass:string,
        public email:string,
        public image: string,
        public role:string,
        public gettoken: string
    ){}
}