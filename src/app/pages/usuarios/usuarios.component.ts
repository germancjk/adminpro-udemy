import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();

    // recibo la respuesta del emmiter siempre que hay un cambio
    this._modalUploadService.notificacion.subscribe( resp => this.cargarUsuarios());
  }

  mostrarModal( id: string) {
    this._modalUploadService.mostrarModal('usuarios', id);
  }

  cargarUsuarios() {

    this._usuarioService.cargarUsuarios( this.desde )
      .subscribe( (resp: any) => {

        this.totalRegistros = resp.total;
        this.usuarios = resp.usuarios;
        this.cargando = false;
      });
  }

  cambiarDesde( valor: number) {

    this.cargando = true;

    let desde = this.desde + valor;

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario( termino: string ) {

    if ( termino.length >= 3 ) {
    this._usuarioService.buscarUsuarios( termino )
      .subscribe( (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
      });
    }
  }

  borrarUsuario( usuario: Usuario ) {

    if ( usuario._id === this._usuarioService.usuario._id ) {
      Swal.fire('No se puede borrar usuario', 'No puede borrar a si mismo', 'error');
      return;
    }

    Swal.fire({
      title: '¿Está Seguro?',
      text: 'Está a punto de borrar a ' + usuario.nombre,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo!'
    }).then((result) => {
      if (result.value) {
        this._usuarioService.borrarUsuario( usuario._id )
          .subscribe( resp => {
            console.log(resp);
            // Recargo el listado porque recién se eliminó uno
            this.desde = 0;
            this.cargarUsuarios();

            Swal.fire(
              'Eliminado!',
              'El usuario' + usuario.nombre + ' fue eliminado',
              'success'
            );
          });
      }
    });
  }

  guardarUsuario( usuario: Usuario ) {

    this._usuarioService.actualizarUsuario(usuario)
      .subscribe();
  }

}
