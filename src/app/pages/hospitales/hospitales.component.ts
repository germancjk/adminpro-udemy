import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospital/hospital.service';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    private _hospitalService: HospitalService,
    private _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();

    // recibo la respuesta del emmiter siempre que hay un cambio
    this._modalUploadService.notificacion.subscribe( () => this.cargarHospitales());
  }

  mostrarModal( id: string) {
    this._modalUploadService.mostrarModal('hospitales', id);
  }

  cargarHospitales() {

    this._hospitalService.cargarHospitales()
      .subscribe( (resp: any) => {
        this.totalRegistros = this._hospitalService.totalHospitales;
        this.hospitales = resp;
        this.cargando = false;
      });
  }

  buscarHospital( termino: string) {

    if ( termino.length < 3) {
      return;
    }

    this._hospitalService.buscarHospital( termino )
      .subscribe( (resp: any) => {
        this.hospitales = resp;
      });
  }

  actualizarHospital( hospital: Hospital ) {

    this._hospitalService.actualizarHospital( hospital )
      .subscribe();
  }

  borrarHospital( hospital: Hospital ) {

    Swal.fire({
      title: '¿Está Seguro?',
      text: 'Está a punto de borrar: ' + hospital.nombre,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo!'
    }).then((result) => {
      if (result.value) {
        this._hospitalService.borrarHospital( hospital._id )
          .subscribe( resp => {
            // Recargo el listado porque recién se eliminó uno
            this.cargarHospitales();

            Swal.fire(
              'Eliminado!',
              'El hospital ' + hospital.nombre + ' fue eliminado',
              'success'
            );
          });
      }
    });
  }

  async crearHospital() {

    const {value: valor} = await Swal.fire({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del hospital',
      input: 'text',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Ingresa Nombre de Hospital';
        }
      }
    });

    if (valor) {
      this._hospitalService.crearHospital( valor )
        .subscribe( () => this.cargarHospitales());
    }
  }

}
