import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing.module';
import { RolesRoutingModule } from '../roles/roles-routing.module';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StaffRoutingModule,
    FormsModule,  
    RolesRoutingModule,
    RouterModule,
    SharedModule,
  ]
})
export class StaffModule { }
