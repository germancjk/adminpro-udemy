import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {

  path: import('@angular/router').ActivatedRouteSnapshot[];
  route: import('@angular/router').ActivatedRouteSnapshot;

  constructor( public usuarioService: UsuarioService) {

  }

  canActivate() {

    if ( this.usuarioService.estaLogueado() ) {
      // console.log('PASO EL GUARD');
      return true;
    } else {
      // console.log('BLOQUEADO POR GUARD');
      return false;
    }
  }
}
