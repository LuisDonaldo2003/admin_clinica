import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public routes = routes;
  public user: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      console.log('User data:', user); // Verificar los datos del usuario
      this.user = user;
    });
  }

  getRole(){
    let RoleName = "";
    this.user.roles.forEach((rol:any) => {
      RoleName = rol;
    });
    return RoleName;
  }
}
