import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router
  ) {}

  canActivate(): Promise<boolean> | boolean {

    let token = this._usuarioService.token;
    let payload = JSON.parse( atob(token.split('.')[1]) );

    let expirado = this.expirado( payload.exp );

    if ( expirado ) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.verificaRenueva( payload.exp );
  }

  // Veo si renuevo o no el token previo a expirar
  verificaRenueva( fechaExp: number ): Promise<boolean> {

    return new Promise( (resolve, reject) => {

      let tokenExp = new Date( fechaExp * 1000); // de segundos a milisegundos
      let ahora = new Date();

      ahora.setTime( ahora.getTime() + (1 * 60 * 60 * 1000)); // chequeo si falta 1 hora para que venza el token

      if ( tokenExp.getTime() > ahora.getTime() ) {
        resolve( true );
      } else {

        this._usuarioService.renuevaToken()
          .subscribe( () => {
            resolve ( true );
          }, () => {
            this.router.navigate(['/login']);
            reject ( false );
          });
      }

      resolve( true );
    });
  }

  expirado( fechaExp: number ) {

    let ahora = new Date().getTime() / 1000; // la fecha getTime está en milisegundos y fechaExp está en segundos

    if ( fechaExp < ahora ) {
      return true;
    } else {
      return false;
    }
  }
}
