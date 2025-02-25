import { Component } from '@angular/core';
import { RolesService } from '../service/roles.service';
import { DataService } from 'src/app/shared/data/data.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-role-user',
  templateUrl: './edit-role-user.component.html',
  styleUrls: ['./edit-role-user.component.scss']
})
export class EditRoleUserComponent {

  sideBar:any = [];
  name:string = '';
  permissions:any = [];
  valid_form: boolean = false;
  valid_form_success: boolean = false;
  text_validation:any = null;

  role_id:any;
  constructor(
    public DataService: DataService ,
    public RoleService: RolesService,
    public activedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.sideBar = this.DataService.sideBar[0].menu;
    this.activedRoute.params.subscribe((resp:any) => {
      this.role_id = resp.id;
    });
    this.showRole();
  }

  showRole(){
    this.RoleService.showRoles(this.role_id).subscribe((resp:any) => {
      console.log("Datos del rol obtenidos:", resp);
      this.name = resp.name;
      this.permissions = resp.permission_pluck;
    });
  }

  addPermission(subMenu: any) {
    if (!subMenu || !subMenu.permision) {
        console.error("Error: El subMenu o su permiso es inválido", subMenu);
        return;
    }

    let INDEX = this.permissions.indexOf(subMenu.permision);
    if (INDEX !== -1) {
        this.permissions.splice(INDEX, 1);
    } else {
        this.permissions.push(subMenu.permision);
    }

    console.log("Permisos actualizados (después de hacer clic):", this.permissions);
}



save(){
  this.valid_form = false;
  if (!this.name || this.permissions.length == 0) {
    this.valid_form = true;
    console.log("Error: Debes seleccionar al menos un permiso.");
    return;
  }

  let data = {
    name: this.name,
    permissions: this.permissions,
  };

  console.log("Datos enviados al API:", JSON.stringify(data));

  this.valid_form_success = false;
  this.text_validation = null;
  this.RoleService.editRoles(data, this.role_id).subscribe((resp:any) => {
    console.log("Respuesta del servidor:", resp);
    if (resp.message == 403) {
      this.text_validation = resp.message_text;
      return;
    }
    this.valid_form_success = true;

    // Redirigir a la lista de roles después de actualizar
    setTimeout(() => {
        this.router.navigate(['/roles/list']);
    }, 1000); // Dar tiempo para mostrar el mensaje de éxito antes de redirigir
  });
}

}
