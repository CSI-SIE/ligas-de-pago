import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http'
import { Observable, map} from 'rxjs'
import { environment } from 'src/environments/environment'


@Injectable({
  providedIn: 'root'
})
export class ServicioBase {
/**
 * Inyección de dependencias.
 */
private httpclient = inject(HttpClient);
/**
 * URL del endpoint que usará la aplicación para conectarse a la api.
 */
//private static readonly API_URL = 'api/administrativo/xxxxxxxxx.php'/**cambiar a la que si va a ser :D  */
private static readonly API_URL = 'api/contraloria/LigasPagoApi.php';
constructor() { }

  protected consulta(
    params:any,
    apiurl:string = ServicioBase.API_URL
  ):Observable<any>{
    const formData: FormData= new FormData();

    Object.keys(params).forEach((key) =>{
      formData.append(key, params[key]);
    });

    return this.httpclient
    .post<any>(environment.server + apiurl, formData)
    .pipe(map((res) =>(res.info ? res.info : res)));
  }

  protected consultaDetallada(
    params: any,
    apiurl:string=ServicioBase.API_URL
  ):Observable<HttpEvent<any>>{
    const formData: FormData = new FormData();

    Object.keys(params).forEach((key) => {
      formData.append(key, params[key]);
    });

    const peticion = new HttpRequest(
      'POST',
      environment.server + apiurl,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
      }
    );
      return this.httpclient.request(peticion);
  };

}
