import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RolesService } from '../service/roles.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-role-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './list-role-user.component.html',
  styleUrls: ['./list-role-user.component.scss']
})
export class ListRoleUserComponent {
  public rolesList: any = [];
  dataSource!: MatTableDataSource<any>;

  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<any> = [];
  public totalPages = 0;
  public role_generals: any = [];
  public role_selected: any;

  public routes = {
    addDoctor: '/medical/roles/add-role',
    editDoctor: '/medical/roles/edit-role'
  };

  constructor(public RoleService: RolesService) { }

  ngOnInit() {
    this.getTableData();
  }

  private getTableData(): void {
    console.log("Obteniendo lista de roles...");
    this.RoleService.listRoles().subscribe(
      (resp: any) => {
        console.log("Respuesta del servicio:", resp);
        if (resp && resp.roles && Array.isArray(resp.roles)) {
          this.totalData = resp.roles.length;
          this.role_generals = resp.roles;
          this.rolesList = [...this.role_generals]; // Clon para evitar modificaciones directas
          this.dataSource = new MatTableDataSource<any>(this.rolesList);
          this.calculateTotalPages(this.totalData, this.pageSize);
        }
      },
      (error) => {
        console.error("Error al obtener la lista de roles:", error);
      }
    );
  }

  getTableDataGeneral() {
    this.rolesList = [];
    this.serialNumberArray = [];
    this.role_generals.forEach((res: any, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.rolesList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });

    this.dataSource = new MatTableDataSource<any>(this.rolesList);
    this.calculateTotalPages(this.totalData, this.pageSize);
  }

  selectRole(rol: any) {
    this.role_selected = rol;
  }

  deleteRole() {
    if (!this.role_selected) return;
    
    console.log(`Eliminando el rol: ${this.role_selected.name}`);
    
    this.RoleService.deleteRoles(this.role_selected.id).subscribe(
      (resp: any) => {
        console.log("Rol eliminado con éxito:", resp);

        // Filtrar la lista de roles para eliminarlo visualmente sin recargar
        this.rolesList = this.rolesList.filter((role: any) => role.id !== this.role_selected.id);
        this.dataSource = new MatTableDataSource<any>(this.rolesList);

        // Cerrar el modal después de eliminar
        const modalId = `#delete_patient-${this.role_selected.id}`;
        (document.querySelector(modalId) as HTMLElement)?.classList.remove('show');
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }

        this.role_selected = null;
      },
      (error) => {
        console.error("Error al eliminar el rol:", error);
      }
    );
  }

  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.rolesList = this.dataSource.filteredData;
  }

  public sortData(sort: any) {
    const data = this.rolesList.slice();

    if (!sort.active || sort.direction === '') {
      this.rolesList = data;
    } else {
      this.rolesList = data.sort((a: any, b: any) => {
        const aValue = a[sort.active];
        const bValue = b[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getMoreData(event: string): void {
    if (event === 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableDataGeneral();
    } else if (event === 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableDataGeneral();
    }
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    this.pageIndex = pageNumber - 1;
    this.getTableDataGeneral();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.getTableDataGeneral();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 !== 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    for (let i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }

  public refreshData(): void {
    console.log("Actualizando lista de roles...");
    this.getTableData(); // Hacer nueva petición a la API para obtener los datos más recientes
  }
}
