import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'; 
import { MatOptionModule } from '@angular/material/core'; 
import { StaffService } from '../service/staff.service';
import { ActivatedRoute } from '@angular/router';
import { an } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-edit-staff-n',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule  
  ],
  templateUrl: './edit-staff-n.component.html',
  styleUrl: './edit-staff-n.component.scss'
})
export class EditStaffNComponent {
   public selectedValue!: string;
      public name:string = '';
      public surname:string = '';
      public mobile:string = '';
      public email:string = '';
      public password:string = '';
      public password_confirmation:string = '';
      public birth_date:string = '';
      public gender:number = 1;
      public education:string = '';
      public designation:string = '';
      public address:string = '';
  
      public roles:any = [];
  
      public FILE_AVATAR :any;
      public IMAGE_PREVIZUALIZA:any = 'assets/img/user-06.jpg';
  
      public text_success:string = '';
      public text_validation:string = '';
      public staff_id:any;
      public staff_selected:any;

      constructor(
        public staffservice: StaffService,
        public activedRoute: ActivatedRoute,
      ){
      }
  
      ngOnInit(): void{

        this.activedRoute.params.subscribe((resp:any) =>{
          console.log(resp);
          this.staff_id = resp.id;
        })

        this.staffservice.showUser(this.staff_id).subscribe((resp:any) =>{
          console.log(resp);
          this.staff_selected = resp.user;

          this.selectedValue = this.staff_selected.roles?.length ? this.staff_selected.roles[0].id : null; //Actualización de roles
          this.name= this.staff_selected.name;
          this.surname= this.staff_selected.surname;
          this.mobile= this.staff_selected.mobile;
          this.email= this.staff_selected.email;
          this.birth_date= this.staff_selected.birth_date;
          this.gender= this.staff_selected.gender;
          this.education= this.staff_selected.education;
          this.designation= this.staff_selected.designation;
          this.address= this.staff_selected.address;
          this.IMAGE_PREVIZUALIZA = this.staff_selected.avatar ? this.staff_selected.avatar : 'assets/img/user-06.jpg';


        let formattedBirthDate = new Date(this.birth_date).toISOString().split('T')[0]; // Convierte a 'YYYY-MM-DD'
        })

        this.staffservice.listConfig().subscribe((resp:any) =>{
          console.log(resp);
          this.roles = resp.roles;
        })
  
      }
  
  
      save() {
  
        this.text_validation =   '';  
        if(!this.name || !this.email || !this.surname ){
          this.text_validation = 'Los siguientes campos son obligatorios (name,surname,email)';
          return; 
        }
        

        if(this.password){
          if(this.password != this.password_confirmation){
            this.text_validation = 'Las contraseñas no coinciden';
            return; 
          }
        }
      
        console.log(this.selectedValue);
      
        let formattedBirthDate = new Date(this.birth_date).toISOString().split('T')[0]; // Convierte a 'YYYY-MM-DD'
      
        let fromData = new FormData();
        
        fromData.append('name', this.name);
        fromData.append('surname', this.surname);
        fromData.append('mobile', this.mobile);
        fromData.append('email', this.email);
        fromData.append('birth_date', formattedBirthDate); // Se envía en formato correcto 


        if(this.password){
          fromData.append('password', this.password);
        }

        if(this.designation){
          fromData.append('designation', this.designation);
        }

        if(this.address){
          fromData.append('address', this.address);
        }

        if(this.education){
          fromData.append('education', this.education);
        }
        fromData.append('gender', this.gender + "");

        if(this.FILE_AVATAR){
          fromData.append('imagen', this.FILE_AVATAR);
        }
        fromData.append('role_id', this.selectedValue);
      
        this.staffservice.updateUser(this.staff_id,fromData).subscribe((resp: any) => {
          console.log(resp);
          if(resp.message == 403){
            this.text_validation = resp.message_text;
          }else{
            this.text_success = 'Usuario registrado correctamente';
  
          }
        });
      }
      
      loadFile($event: any) {
        if($event.target.files[0].type.indexOf('image') < 0){
          // alert('Please select image file only');
          this.text_validation = 'Solamente pueden ser archivos de tipo imagen';
          return;
          }
  
          this.text_validation ='';
          this.FILE_AVATAR = $event.target.files[0];
          let reader = new FileReader();
          reader.readAsDataURL(this.FILE_AVATAR);
          reader.onloadend = () => this.IMAGE_PREVIZUALIZA = reader.result;
        }
}
