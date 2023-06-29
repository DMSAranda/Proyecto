//no utilizado finalmente

import { Injectable, Pipe, PipeTransform} from '@angular/core'

@Pipe({
        name: 'filterProject'
     })
     
@Injectable()
export class ProjectPipe implements PipeTransform{
   
   //recibimos una serie de items  y datos de proyecto
    transform(items: any, term: any): any{
        
        if(term === undefined || term === null){
            return items;
            }
       //creamos un filtro que compara la lista de usuarios con los id del proyecto 
       //si coinciden usuario y proyectio , mete el proyectyo al array y dinalmente devuelve este
       
        return items.filter(function(item:any){
            
            if (item.user._id === term._id)
            
            return item;
        });    
            
    }
}