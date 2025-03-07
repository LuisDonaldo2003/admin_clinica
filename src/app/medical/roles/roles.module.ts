import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // ✅ Importamos FormsModule para ngModel
import { RolesRoutingModule } from './roles-routing.module';
import { EditRoleUserComponent } from './edit-role-user/edit-role-user.component'; // ✅ Agregamos el componente edit-role

@NgModule({
  declarations: [
    EditRoleUserComponent, 
  ],
  imports: [
    CommonModule,
    FormsModule,  
    RolesRoutingModule
  ]
})
export class RolesModule { }
