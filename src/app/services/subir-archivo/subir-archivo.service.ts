import { Injectable } from '@angular/core';
import { URL_SERVICES } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor() { }

  subirArchivo( archivo: File, tipo: string, id: string) {

    return new Promise( (resolve, reject) => {
      let formData = new FormData();
      let xhr = new XMLHttpRequest();

      // 'imagen' es el nombre de la variable donde se envía el archivo
      formData.append('imagen', archivo, archivo.name);

      xhr.onreadystatechange = function() {
        if ( xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log('Imagen Subida');
            resolve( JSON.parse( xhr.response ));
          } else {
            console.log('Fallo en subida');
            reject( JSON.parse( xhr.response ) );
          }
        }
      };

      const url = URL_SERVICES + '/upload/' + tipo + '/' + id;

      xhr.open('PUT', url, true);
      xhr.send( formData );
    });
  }
}
