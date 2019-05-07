import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html'
})
export class IncrementadorComponent implements OnInit {

  // Decorador para hacer referencia a un html en particular
  @ViewChild('txtProgress') txtProgress: ElementRef;

  // Ingreso de datos desde selector ej: <app-incrementador [leyenda]="algo"></app-incrementador>
  @Input() leyenda: string  = 'Leyenda';
  @Input() progreso: number = 50;

  // Evento para enviar información desde dentro de: <app-incrementador> hacia afuera
  @Output() cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onChanges( newValue: number ) {
    //const elemHTML: any = document.getElementsByName('progreso')[0];

    if ( newValue >= 100) {
      this.progreso = 100;
    } else if ( newValue <= 0) {
      this.progreso = 0;
    } else {
      this.progreso = newValue;
    }

    //elemHTML.value = this.progreso;

    this.cambioValor.emit( this.progreso );
    this.txtProgress.nativeElement.value = this.progreso;
  }

  cambiarValor(valor: number) {
    if ( valor >= 100) {
      this.progreso = 100;
    } else if ( valor <= 0) {
      this.progreso = 0;
    } else {
      this.progreso = this.progreso + valor;
    }

    // Emito hacia afuera el valor para poder utilizarlo en el html
    this.cambioValor.emit( this.progreso );
    this.txtProgress.nativeElement.focus();
  }


}
