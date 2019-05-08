import { Component, OnInit } from '@angular/core';

// Llama al método que comienza los plugins por fuera
// Ya sean métodos de bootstrap o lo que sea
// En este caso el archivo: custom.js en index.html para cargar el menú
declare function init_plugins();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: []
})
export class PagesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    init_plugins();
  }

}
