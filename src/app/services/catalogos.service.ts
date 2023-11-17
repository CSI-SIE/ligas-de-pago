import { Injectable } from '@angular/core';
import { ServicioBase } from './servicio-base.service';
import { Router } from '@angular/router';
import { PER_BuscadoresPersonas } from '../shared/models/parametros-api/PER_BuscadoresPersonas.model';
import { BehaviorSubject, Observable, map, takeWhile } from 'rxjs';
import { Buscador25 } from '../shared/models/Buscador25.model';
import { ObtenerCatalogosPeriodosyFechas } from '../shared/models/parametros-api/ObtenerCatalogoPeriodosyFechas.model'
import { ListadoLigasDePago } from '../shared/models/parametros-api/ListadoLigasDePago.model';


@Injectable({
  providedIn: 'root'
})
export class CatalogosService extends ServicioBase {

  constructor(private router:Router ) {
    super();
   }

   public recargarTabla = new BehaviorSubject<number>(0);
  public recargarTabla$ = this.recargarTabla.asObservable();

   public obtenerCatalogoPeriodo_o_Fecha(extras:ObtenerCatalogosPeriodosyFechas){
    const parametros = {

      servicio:'ligas',
      accion: 'CON_LigasdePagoCatalogos',
      tipoRespuesta:'json'
    };
    return this.consulta({...parametros,...extras},'/api/contraloria/LigasPagoApi.php')
   }

   public obtenerListadoLigasDePago(extras:ListadoLigasDePago){

    const parametros = {
      servicio:'ligas',
      accion: 'CON_LigasPagoListado',
      tipoRespuesta:'json'
    };
    return this.consulta({...parametros,...extras},'/api/contraloria/LigasPagoApi.php')
   }

   public generarLigaIndividual(extras:any){

    const parametros = {
      servicio:'ligas',
      accion: 'CON_LigaWebPagos_GeneraAdeudo',
      tipoRespuesta:'json'
    };
    return this.consulta({...parametros,...extras},'/api/contraloria/LigasPagoApi.php')
   }

//$.post("/includes/snippets/buscadorJQ/Proceso_Busqueda.php?
//identificador="+id+"&
//idtipo="+$("#inputString"+id).attr("tipo")+"&
//y="+Math.random(),
   public PER_BuscadoresPersonas(extras: PER_BuscadoresPersonas): Observable<Buscador25[]>{
    const parametros = {
      servicio:'buscador',
      accion:'PER_BuscadoresPersonas',
      tipoRespuesta: 'json'
    };
    return this.consulta({...parametros, ...extras}, '/api/Buscador/buscador.php');
  }

}
