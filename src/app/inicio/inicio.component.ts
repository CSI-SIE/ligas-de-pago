import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GenerarDeListadoComponent } from '../tabs/generar-de-listado/generar-de-listado.component';
import { GenerarIndividualComponent } from '../tabs/generar-individual/generar-individual.component';
import { HistorialComponent } from '../tabs/historial/historial.component';
import {MatTabsModule} from '@angular/material/tabs';


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
export class InicioComponent {

}
