import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GenerarDeListadoComponent } from '../tabs/generar-de-listado/generar-de-listado.component';
import { GenerarIndividualComponent } from '../tabs/generar-individual/generar-individual.component';
import { HistorialComponent } from '../tabs/historial/historial.component';
import {MatTabsModule} from '@angular/material/tabs';
import { CatalogosService } from '../services/catalogos.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  standalone: true,
  imports:[
    CommonModule,
    GenerarDeListadoComponent,
    GenerarIndividualComponent,
    HistorialComponent,
    MatTabsModule

  ]
})
export class InicioComponent implements OnInit {

  private suscripciones: Subscription[];

  constructor(
    private _catalogosService:CatalogosService,
  ){

    this.suscripciones=[];
  }

  tienePermiso = false;



  ngOnInit(): void {

    const sesion$ = this._catalogosService.permisos().subscribe(
      {
        next:(data) =>{
          try{
            if(data[0].tienePermiso == 1){
              this.tienePermiso = true;
              //console.log('Tiene permiso Generar individual: Si');
            }
            else
            {
              this.tienePermiso = false;
              //console.log('Tiene permiso Generar individual: No');
            }
          }
          catch{
            console.log('Sucedió un error al comparar la respuesta de la api a numerico.');
          }
      },
        error: (errores) =>{
          console.error(errores);
        }
      }
    );
    this.suscripciones.push(sesion$);
    //=====================================
}


}
