import { Injectable } from '@angular/core'
import { Global } from './global'


//creamos una clase exportable e injectable con todos el  metodos para las solicitudes HTTP para
//la carga de ficheros en el servidor

@Injectable()
export class UploadService{
 
    public url: string;
    
    constructor(){
         this.url = Global.url;    
    }
    
    //El método principal del servicio, que se utiliza para realizar la solicitud de carga 
    //de archivos al servidor a traves de url, parametros, array de ficheros y el nombre del campo 
    
    makeFileRequest(url: string, params: Array<string>, file: Array<File>, name: string){
       
        return new Promise(function(resolve, reject){
            
            //crea un formulario multipart
            var formData: any = new FormData();
            
            //solicitud http
            var xhr = new XMLHttpRequest();
            
            //se agrega cada archivo al formulario
            for(var i= 0; i< file.length; i++){
                
                formData.append(name, file[i], file[i].name);
                
            }
            
            //se utiliza para controlar el estado de la solicitud hasta que es correcta
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        resolve(JSON.parse(xhr.response));
                    }else{
                        reject(xhr.response);
                    }
                }
            }
            
            //se abre la conexion y envia el fotrmulario
            xhr.open('POST', url, true);
            xhr.send(formData);
            
        });
    }
}