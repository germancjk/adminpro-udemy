import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit , OnDestroy {

  subscription: Subscription;

  constructor() {

    this.subscription = this.regresaObservable().pipe(
      retry(2) // número de intentos para retry
    )
    .subscribe(
      numero => console.log('Subscribe', numero),
      error => console.log('Error en Subscribe', error),
      () => console.log('Subscribe Completado!')
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log('La pagina se va a cerrar');

    this.subscription.unsubscribe();
  }

  regresaObservable(): Observable<any> {
    return new Observable( (observer: Subscriber<any>) => {

      let contador = 0;

      const intervalo = setInterval( () => {
        contador++;

        const salida = {
          valor: contador
        };

        observer.next(salida);

        // if ( contador === 3 ) {
        //   clearInterval(intervalo);
        //   observer.complete();
        // }

        // if ( contador === 2 ) {
        //   clearInterval(intervalo);
        //   observer.error('Auxilio!');
        // }
      }, 1000);
    }).pipe(
      // map recibe la respuesta del observable y devuelve el valor transformado que queramos
      map ( resp => resp.valor ), // se puede usar así o: resp => { return resp.valor }
      // filter retorna a fuerza true o false
      filter( ( valor, index ) => {
        console.log('Filter', valor, index);

        if ((valor % 2) === 1) {
          return false;
        } else {
          return true;
        }
      })
    );
  }

}
