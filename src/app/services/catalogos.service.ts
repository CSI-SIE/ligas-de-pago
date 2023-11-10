import { Injectable } from '@angular/core';
import { ServicioBase } from './servicio-base.service';
import { Router } from '@angular/router';
import { PER_BuscadoresPersonas } from '../shared/models/parametros-api/PER_BuscadoresPersonas.model';
import { Observable, map, takeWhile } from 'rxjs';
import { Buscador25 } from '../shared/models/Buscador25.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService extends ServicioBase {

  constructor(private router:Router ) {
    super();
   }

   public obtenerEkisCatalogo(extras:any){
    const parametros = {
      servicio:'xxxxxxx',
      accion: 'yyyyyyyyy',
      tipoRespuesta:'json'
    };
    return this.consulta({...parametros,...extras},'otraApi')
   }

   public PER_BuscadoresPersonas(extras: PER_BuscadoresPersonas): Observable<Buscador25[]>{
    const parametros = {
      servicio:'buscador',
      accion:'PER_BuscadoresPersonas',
      tipoRespuesta: 'json'
    };
    return this.consulta({...parametros, ...extras}, '/api/Buscador/buscador.php');
  }

}
