//MODELO

//importamos la clase user porque se le asigna un usuario al proyecto
import { User } from "./user";

//modelado de los atributos de la clase
export class Project{
    
    constructor(
        
        public _id:string,
        public name:string,
        public description:string,
        public category:string,
        public langs: string,
        public year: number,
        public image: string,
        public user:User
    ){}
}


