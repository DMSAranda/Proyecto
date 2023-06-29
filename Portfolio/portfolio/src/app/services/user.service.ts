import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user'
import { Global } from './global'
import { FormGroup } from '@angular/forms';

//creamos una clase exportable e injectable con todos los metodos CRUD para las solicitudes HTTP hasta las
//rutas correspondientes, en este caso las que tenemos en el controlador de usuarios en Node

@Injectable()
export class UserService{
    
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

	getUser(id: any): Observable<any>{
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.get(this.url + 'user/'+id, {headers: headers});
        }
        
        byPass(user: User): Observable<any>{
            let params = JSON.stringify(user);
            let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                           .set('auth', this.getToken() ); 
            return this._http.post(this.url + 'bypass2', params, {headers: headers});
        }
        
                      
	createUser(user: User): Observable<any>{
                let params = JSON.stringify(user);
                let headers = new HttpHeaders().set('Content-Type', 'application/json');
                return this._http.post(this.url + 'register', params, {headers: headers});
        }
        
        loginUser(user: User, gettoken: string): Observable<any>{
            
                if (gettoken != null){
                                       user.gettoken = gettoken;
                                      }
                let params = JSON.stringify(user);
                let headers = new HttpHeaders().set('Content-Type', 'application/json');
                return this._http.post(this.url + 'login', params, {headers: headers});
        }
        
             
        updateUser(user: User): Observable<any>{
            let params = JSON.stringify(user);
            let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                           .set('auth', this.getToken() );
            return this._http.put(this.url + 'update2/'+ user._id, params, {headers: headers});
        }
        
        sendEmail(data: any): Observable<any>{
            let params = JSON.stringify(data);
            let headers = new HttpHeaders().set('Content-Type', 'application/json')
            return this._http.post(this.url + 'email', params, {headers: headers});
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
