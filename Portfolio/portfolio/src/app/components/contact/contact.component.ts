import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  providers: [UserService]
})
export class ContactComponent implements OnInit {
  public title: string;
  public status: string;
  public data: {
    name: string,
    surname: string,
    subject: string,
    message: string,
    email: string
  };
  
   //establecemos los valores de los atributos que luego utilizamos en el fichero html
  
  constructor(
        private _userService: UserService
        ) {
            this.status = '';
            this.title = "Contact";
            this.data = {
                         name: '',
                         surname: '',
                         subject: '',
                         message: '',
                         email: ''
                       };
      }
  
  ngOnInit(): void {
   
  }
  
  //funcion que recibe los parametros del formuñlario de contacto y los envia al controlador para realizar el envio
  //si el envio es exitoso resetea los valores, sino los deja

  onSubmit(form: NgForm)  {
        this._userService.sendEmail(this.data).subscribe(
            (response: any) => {
              console.log(response);
              this.status = 'success'; // Envío exitoso
              form.resetForm(); // Restablecer el formulario
            },
            (error: any) => {
              console.error(error);
              this.status = 'failed'; // Error en el envío
            }
        );
  }
}
