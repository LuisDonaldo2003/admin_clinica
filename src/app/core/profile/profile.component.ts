import { Component, OnInit } from '@angular/core';
import { ProfileService } from './service/profile.service';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public profileData: any;
  public roles: string[] = []; // Añadir roles
  public routes = routes;

  constructor(public profileService: ProfileService) {}

  ngOnInit() {
    this.getProfileData();
  }

  private getProfileData(): void {
    this.profileService.getProfile().subscribe((resp: any) => {
      this.profileData = resp.data;
      this.roles = resp.roles; // Asignar roles
    });
  }
}
