import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { StaffService } from '../service/staff.service';

@Component({
  selector: 'app-list-staff-n',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule], // Agregado FormsModule, RouterModule y CommonModule
  templateUrl: './list-staff-n.component.html',
  styleUrl: './list-staff-n.component.scss'
})
export class ListStaffNComponent {
  public usersList: any = [];
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
    public staff_selected: any;
  
    public routes = {
      addDoctor: '/medical/roles/add-role',
      editDoctor: '/medical/roles/edit-role'
    };
  
    constructor(public staffService: StaffService) { }
  
    ngOnInit() {
      this.getTableData();
    }
  
    private getTableData(): void {
      console.log("Obteniendo lista de roles...");
      this.staffService.listUsers().subscribe(
        (resp: any) => {
          console.log("Respuesta del servicio:", resp);
    
          // Verificar si la respuesta tiene la estructura esperada
          if (resp && resp.users && Array.isArray(resp.users.data)) {
            this.totalData = resp.users.data.length;
            this.usersList = [...resp.users.data]; 
            this.dataSource = new MatTableDataSource<any>(this.usersList);
            this.calculateTotalPages(this.totalData, this.pageSize);
            console.log("Usuarios cargados en la tabla:", this.usersList);
          } else {
            console.error("La respuesta del servicio no tiene la estructura esperada", resp);
          }
        },
        (error) => {
          console.error("Error al obtener la lista de roles:", error);
        }
      );
    }
    
  
    getTableDataGeneral() {
      this.usersList = [];
      this.serialNumberArray = [];
      this.role_generals.forEach((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          this.usersList.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
  
      this.dataSource = new MatTableDataSource<any>(this.usersList);
      this.calculateTotalPages(this.totalData, this.pageSize);
    }
  
    selectUser(rol: any) {
      this.staff_selected = rol;
    }
  
    deleteUser() {

      // if (!this.staff_selected) return;
      
      // console.log(`Eliminando el rol: ${this.staff_selected.name}`);
      
      // this.staffService.deleteRoles(this.staff_selected.id).subscribe(
      //   (resp: any) => {
      //     console.log("Rol eliminado con éxito:", resp);
  
      //     // Filtrar la lista de roles para eliminarlo visualmente sin recargar
      //     this.usersList = this.usersList.filter((role: any) => role.id !== this.staff_selected.id);
      //     this.dataSource = new MatTableDataSource<any>(this.usersList);
  
      //     // Cerrar el modal después de eliminar
      //     const modalId = `#delete_patient-${this.staff_selected.id}`;
      //     (document.querySelector(modalId) as HTMLElement)?.classList.remove('show');
      //     document.body.classList.remove('modal-open');
      //     const backdrop = document.querySelector('.modal-backdrop');
      //     if (backdrop) {
      //       backdrop.remove();
      //     }
  
      //     this.staff_selected = null;
      //   },
      //   (error) => {
      //     console.error("Error al eliminar el rol:", error);
      //   }
      // );
    }
  
    public searchData(value: any): void {
      this.dataSource.filter = value.trim().toLowerCase();
      this.usersList = this.dataSource.filteredData;
    }
  
    public sortData(sort: any) {
      const data = this.usersList.slice();
  
      if (!sort.active || sort.direction === '') {
        this.usersList = data;
      } else {
        this.usersList = data.sort((a: any, b: any) => {
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
