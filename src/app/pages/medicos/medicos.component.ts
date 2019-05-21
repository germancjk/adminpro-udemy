import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/medico/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  cargando: boolean = true;
  medicos: Medico[] = [];

  constructor(
    public _medicoService: MedicoService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this._medicoService.cargarMedicos()
      .subscribe( medicos => {
        this.medicos = medicos;
        this.cargando = false;
      });
  }

  buscarMedico( termino: string) {
    this._medicoService.buscarMedicos( termino )
      .subscribe( medicos => {
        this.medicos = medicos;
        this.cargando = false;
      });
  }

  borrarMedico( medico: Medico ) {
      Swal.fire({
        title: '¿Está Seguro?',
        text: 'Está a punto de borrar: ' + medico.nombre,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminarlo!'
      }).then((result) => {
        if (result.value) {
          this._medicoService.borrarMedico(medico._id)
            .subscribe( resp => {
              // Recargo el listado porque recién se eliminó uno
              this.cargarMedicos();

              Swal.fire(
                'Eliminado!',
                'El Médico ' + medico.nombre + ' fue eliminado',
                'success'
              );
            });
        }
      });
  }

}
