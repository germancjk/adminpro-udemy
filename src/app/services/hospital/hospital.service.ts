import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { Hospital } from 'src/app/models/hospital.model';

import { map } from 'rxjs/internal/operators/map';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  public totalHospitales = 0;
  private token: string;

  constructor(
    private http: HttpClient,
    private _usuarioService: UsuarioService,
    private _subirArchivoService: SubirArchivoService
  ) {}

  cargarHospitales() {

    const url = URL_SERVICES + '/hospital';

    return this.http.get( url ).pipe(
      map( (resp: any) => {
        this.totalHospitales = resp.total;
        return resp.hospitales;
      })
    );
  }

  obtenerHospital( id: string ) {

    const url = URL_SERVICES + '/hospital/' + id;

    return this.http.get( url ).pipe(
      map( (resp: any) => {
        return resp.hospital;
      })
    );
  }

  buscarHospital( termino: string ) {

    const url = URL_SERVICES + '/busqueda/coleccion/hospitales/' + termino;

    return this.http.get( url ).pipe(
      map( (resp: any) => resp.hospitales)
    );
  }

  cambiarImagen( file: File, id: string) {

    this._subirArchivoService.subirArchivo( file, 'hospital', id)
      .then( (resp: any) => {
        console.log(resp);
      })
      .catch( err => {
        console.log(err);
      });
  }

  actualizarHospital( hospital: Hospital ) {

    let url = URL_SERVICES + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put( url, hospital ).pipe(
      map( (resp: any) => {
        Swal.fire('Hospital actualizado', hospital.nombre, 'success');

        return resp.hospital;
      })
    );
  }

  borrarHospital( id: string) {

    let url = URL_SERVICES + '/hospital/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete ( url );
  }

  crearHospital( nombre: string ) {

    let url = URL_SERVICES + '/hospital';
    url += '?token=' + this._usuarioService.token;

    return this.http.post( url, { nombre } ).pipe(
      map( (resp: any) => resp.hospital)
    );
  }
}
