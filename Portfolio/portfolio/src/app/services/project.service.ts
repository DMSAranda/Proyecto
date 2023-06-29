import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project'
import { Global } from './global'
import { User } from '../models/user';

//creamos una clase exportable e injectable con todos los metodos CRUD para las solicitudes HTTP hasta las
//rutas correspondientes, en este caso las que tenemos en el controlador de proyectos en Node

@Injectable()
export class ProjectService{
    
	public url: string;
        private token: string;
        private expiresIn : string;
	
	constructor(
		public _http: HttpClient
	){
		this.url = Global.url;
                this.token = '';
                this.expiresIn = '';
	}
        
         
        saveProject(project: Project): Observable<any>{
                let params = JSON.stringify(project);
                let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                               .set('auth', this.getToken() );  
                return this._http.post(this.url + 'save', params, {headers: headers});
        }
        
        getProjects(): Observable<any>{
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.get(this.url + 'projects', {headers: headers});
        }
        
                
        getProject(id: any): Observable<any>{
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.get(this.url + 'project/'+id, {headers: headers});
        }
        
        deleteProject(id: any): Observable<any>{
            let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                           .set('auth', this.getToken() );  
            return this._http.delete(this.url + 'delete/'+id, {headers: headers});
        }
        
        updateProject(project: Project): Observable<any>{
            let params = JSON.stringify(project);
            let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                           .set('auth', this.getToken() );   
            return this._http.put(this.url + 'update/'+ project._id, params, {headers: headers});
        }
            
        getIdentity(): User{
            let identity = JSON.parse(localStorage.getItem('identity')!);
           
            return identity;
            
        }   
        
        getToken(): string{
            let token = JSON.parse(localStorage.getItem('token')!);
           
            return token;
        }  

}
