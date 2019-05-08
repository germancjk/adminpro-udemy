import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() {

    this.contarTres().then(
      (mensaje) => console.log('Promesa Finalizada', mensaje)
    )
    .catch( error => console.error('Error en promesa', error) );
  }

  ngOnInit() {
  }

  contarTres(): Promise<boolean> {
    return new Promise( (resolve, reject) => {

      let contador = 0;
      console.log(contador);

      const intervalo = setInterval( () => {
        contador++;
        console.log(contador);

        if ( contador === 3 ) {
          resolve( true );
          // reject(); // puedo también enviarle error al completar
          clearInterval(intervalo);
        }
      }, 1000);
    });
  }
}
