import { Component } from '@angular/core';
import { DoctorService } from '../service/doctor.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-list-doctor',
  templateUrl: './list-doctor.component.html',
  styleUrls: ['./list-doctor.component.scss']
})
export class ListDoctorComponent {
  public usersList:any = [];
  dataSource!: MatTableDataSource<any>;

  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;//MIN
  public limit: number = this.pageSize;//MAX
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<any> = [];
  public totalPages = 0;

  public role_generals:any = [];
  public doctor_selected:any;
  constructor(
    public doctorService: DoctorService,
  ){

  }
  ngOnInit() {
    this.getTableData();
  }
  private getTableData(): void {
    this.usersList = [];
    this.serialNumberArray = [];

    this.doctorService.listDoctors().subscribe((resp:any) => {

      console.log(resp);

      this.totalData = resp.users.data.length;
      this.role_generals = resp.users.data;
      this.getTableDataGeneral();
    })


  }

  

  getTableDataGeneral() {
    this.usersList = [];
    this.serialNumberArray = [];

    this.role_generals.map((res: any, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        
        this.usersList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
    this.dataSource = new MatTableDataSource<any>(this.usersList);
    this.calculateTotalPages(this.totalData, this.pageSize);
  }

  selectUser(rol:any){
    this.doctor_selected = rol;
  }

  deleteUser() {
    if (!this.doctor_selected || !this.doctor_selected.id) {
      console.error("No se ha seleccionado ningún doctor válido para eliminar.");
      return;
    }
  
    console.log(`Eliminando al doctor: ${this.doctor_selected.name} con ID ${this.doctor_selected.id}`);
  
    this.doctorService.deleteDoctor(this.doctor_selected.id).subscribe(
      (resp: any) => {
        console.log("Doctor eliminado con éxito:", resp);
  
        // Filtrar la lista de doctores para eliminarlo visualmente sin recargar la página
        this.usersList = this.usersList.filter((user: any) => user.id !== this.doctor_selected.id);
        this.dataSource = new MatTableDataSource<any>(this.usersList);
  
        // Cerrar el modal manualmente
        const modalElement = document.getElementById('delete_patient');
        if (modalElement) {
          modalElement.style.display = 'none';
          modalElement.classList.remove('show');
        }
  
        // Eliminar backdrop de Bootstrap si existe
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
  
        // Remover clase y estilos del body
        document.body.classList.remove('modal-open');
        document.body.removeAttribute('style');
  
        // Resetear la variable del doctor seleccionado
        this.doctor_selected = null;
      },
      (error) => {
        console.error("Error al eliminar el doctor:", error);
      }
    );
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.usersList = this.dataSource.filteredData;
  }

  public sortData(sort: any) {
    const data = this.usersList.slice();

    if (!sort.active || sort.direction === '') {
      this.usersList = data;
    } else {
      this.usersList = data.sort((a:any, b:any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (a as any)[sort.active];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getMoreData(event: string): void {
    if (event == 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableDataGeneral();
    } else if (event == 'previous') {
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
    if (pageNumber > this.currentPage) {
      this.pageIndex = pageNumber - 1;
    } else if (pageNumber < this.currentPage) {
      this.pageIndex = pageNumber + 1;
    }
    this.getTableDataGeneral();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.searchDataValue = '';
    this.getTableDataGeneral();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    /* eslint no-var: off */
    for (var i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
      // 1
      // 0 - 10
      // 2
      // 10 - 20
    }
  }
  public refreshData(): void {
    console.log("Actualizando lista de roles...");
    this.getTableData(); // Hacer nueva petición a la API para obtener los datos más recientes
  }
}
