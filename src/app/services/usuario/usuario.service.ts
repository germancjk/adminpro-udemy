import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from 'src/app/models/usuario.model';
import { URL_SERVICES } from '../../config/config';

import { map } from 'rxjs/internal/operators/map';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {

    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;

      this.router.navigate(['/login']);
    }
  }

  guardarStorage( id: string, token: string, usuario: Usuario ) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  logout() {

    this.usuario = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {

    const url = URL_SERVICES + '/login/google';

    return this.http.post( url, { token })
      .pipe(
        map( (resp: any) => {
          this.guardarStorage(resp.id, resp.token, resp.usuario);

          return true;
        })
      );
  }

  login( usuario: Usuario, recordar: boolean = false) {

    if ( recordar ) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICES + '/login';
    return this.http.post( url, usuario)
      .pipe(
        map( (resp: any) => {
          this.guardarStorage(resp.id, resp.token, resp.usuario);

          return true;
        })
      );
  }

  crearUsuario(usuario: Usuario) {

      const url = URL_SERVICES + '/usuario';

      return this.http.post( url, usuario).pipe(
        map( (resp: any) => {
          Swal.fire('Usuario creado', usuario.email, 'success');

          return resp.usuario;
        }));
  }

  actualizarUsuario( usuario: Usuario) {
    let url = URL_SERVICES + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put( url, usuario)
      .pipe(
        map( (resp: any) => {

          if ( usuario._id === this.usuario._id ) {
            const usuarioDB: Usuario = resp.usuario;
            this.guardarStorage( usuarioDB._id, this.token, usuarioDB);
          }

          Swal.fire('Usuario actualizado', usuario.nombre, 'success');

          return true;
        })
      );
  }

  cambiarImagen( file: File, id: string ) {

    this._subirArchivoService.subirArchivo(file, 'usuarios', id)
      .then( (resp: any) => {

        this.usuario.img = resp.usuario.img;
        this.guardarStorage(id, this.token, this.usuario);

        Swal.fire('Imágen Actualizada', this.usuario.nombre, 'success');
      })
      .catch( resp => {
        console.log( resp );
      });
  }

  cargarUsuarios( desde: number = 0) {

    const url = URL_SERVICES + '/usuario?desde=' + desde;

    return this.http.get( url );
  }

  buscarUsuarios( termino: string ) {

    const url = URL_SERVICES + '/busqueda/coleccion/usuarios/' + termino;

    return  this.http.get( url )
      .pipe(
        map( (resp: any) => resp.usuarios )
      );
  }

  borrarUsuario( id: string) {

    let url = URL_SERVICES + '/usuario/' + id;
    url += '?token=' + this.token;

    return this.http.delete( url );
  }
}
