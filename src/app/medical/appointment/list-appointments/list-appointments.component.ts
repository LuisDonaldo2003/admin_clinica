import { Component } from '@angular/core';
import { AppointmentService } from '../service/appointment.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-list-appointments',
  templateUrl: './list-appointments.component.html',
  styleUrls: ['./list-appointments.component.scss']
})
export class ListAppointmentsComponent {
  public appointmentList:any = [];
  dataSource!: MatTableDataSource<any>;

  public showFilter = false;
  public searchDataValue = '';
  public specialitie_id = '';
  public date = null;
  public lastIndex = 0;
  public pageSize = 2;
  public totalData = 0;
  public skip = 0;//MIN
  public limit: number = this.pageSize;//MAX
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<any> = [];
  public totalPages = 0;

  public patient_generals:any = [];
  public appointment_selected:any;

  specialities:any = [];
  constructor(
    public appointmentService: AppointmentService,
  ){

  }
  ngOnInit() {
    this.getTableData();

    this.appointmentService.listConfig().subscribe((resp:any) => {
      this.specialities = resp.specialities;
    })
  }
  private getTableData(page=1): void {
    this.appointmentList = [];
    this.serialNumberArray = [];

    this.appointmentService.listAppointments(page,this.searchDataValue,this.specialitie_id,this.date).subscribe((resp:any) => {

      console.log(resp);
 
      this.totalData = resp.total;
      this.appointmentList = resp.appointments.data;
      // this.getTableDataGeneral();
      this.dataSource = new MatTableDataSource<any>(this.appointmentList);
      this.calculateTotalPages(this.totalData, this.pageSize);
    })


  }

  getTableDataGeneral() {
    this.appointmentList = [];
    this.serialNumberArray = [];

    this.patient_generals.map((res: any, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        
        this.appointmentList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
    this.dataSource = new MatTableDataSource<any>(this.appointmentList);
    this.calculateTotalPages(this.totalData, this.pageSize);
  }

  selectUser(rol:any){
    this.appointment_selected = rol;
  }

  deleteAppointment() {
    if (!this.appointment_selected || !this.appointment_selected.id) {
      console.error("No se ha seleccionado ninguna cita válida para eliminar.");
      return;
    }
  
    console.log(`Eliminando la cita con ID ${this.appointment_selected.id}`);
  
    this.appointmentService.deleteAppointment(this.appointment_selected.id).subscribe(
      (resp: any) => {
        console.log("Cita eliminada con éxito:", resp);
  
        // Filtrar la lista de citas para eliminarla visualmente sin recargar la página
        this.appointmentList = this.appointmentList.filter((appointment: any) => appointment.id !== this.appointment_selected.id);
        this.dataSource = new MatTableDataSource<any>(this.appointmentList);
  
        // Cerrar el modal manualmente sin jQuery
        const modalElement = document.getElementById(`delete_appointment-${this.appointment_selected.id}`);
        if (modalElement) {
          modalElement.style.display = 'none';
          modalElement.classList.remove('show');
        }
  
        // Eliminar backdrop de Bootstrap sin jQuery
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
  
        // Remover clase y estilos del body
        document.body.classList.remove('modal-open');
        document.body.removeAttribute('style');
  
        // Resetear la variable de la cita seleccionada
        this.appointment_selected = null;
      },
      (error) => {
        console.error("Error al eliminar la cita:", error);
      }
    );
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchData() {
    // this.dataSource.filter = value.trim().toLowerCase();
    // this.appointmentList = this.dataSource.filteredData;
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;

    this.getTableData();
  }

  public sortData(sort: any) {
    const data = this.appointmentList.slice();

    if (!sort.active || sort.direction === '') {
      this.appointmentList = data;
    } else {
      this.appointmentList = data.sort((a:any, b:any) => {
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
      this.getTableData(this.currentPage);
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData(this.currentPage);
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
    this.getTableData(this.currentPage);
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.searchDataValue = '';
    this.specialitie_id = '';
    this.date = null;
    this.getTableData();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);//10.6 o 10.9 11
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
      // 3
      // 20 - 30
    }
  }
}