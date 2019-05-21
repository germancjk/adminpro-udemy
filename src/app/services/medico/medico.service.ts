import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { map } from 'rxjs/internal/operators/map';
import { UsuarioService } from '../usuario/usuario.service';
import Swal from 'sweetalert2';
import { Medico } from 'src/app/models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarMedico( id: string ) {

    const url = URL_SERVICES + '/medico/' + id;

    return this.http.get( url ).pipe(
      map( (resp: any) => resp.medico )
    );
  }

  cargarMedicos() {

    const url = URL_SERVICES + '/medico/';

    return this.http.get( url ).pipe(
      map( (resp: any) => {
        this.totalMedicos = resp.total;
        return resp.medicos;
      })
    );
  }

  buscarMedicos( termino: string ) {

    const url = URL_SERVICES + '/busqueda/coleccion/medicos/' + termino;

    return this.http.get( url )
      .pipe(
        map( (resp: any) => resp.medicos )
      );
  }

  borrarMedico( id: string ) {

    let url = URL_SERVICES + '/medico/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete(url).pipe(
      map( (resp: any) => {
        Swal.fire('Médico Borrado', 'Médico eliminado corectamente', 'success');
        return true;
      })
    );
  }

  guardarMedico( medico: Medico) {

    let url = URL_SERVICES + '/medico/';

    if ( medico._id ) {
      // actualizar
      url+= '/' + medico._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put( url, medico ).pipe(
        map( (resp: any) => {

          Swal.fire('Médico Actualizado', medico.nombre, 'success');
          return resp.medico;
        })
      );
    } else {
      // crear
      url += '?token=' + this._usuarioService.token;

      return this.http.post( url, medico ).pipe(
        map( (resp: any) => {
          Swal.fire('Médico Creado', medico.nombre, 'success');
          return resp.medico;
        })
      );
    }
  }
}
