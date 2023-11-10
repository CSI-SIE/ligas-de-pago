import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import { CommonModule } from '@angular/common';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';

import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { Observable, map, startWith } from 'rxjs';
import {MatGridListModule} from '@angular/material/grid-list';


@Component({
  selector: 'generar-individual',
  templateUrl: './generar-individual.component.html',
  styleUrls: ['./generar-individual.component.scss'],
  standalone: true,
  imports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatTabsModule,
    CommonModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatListModule,
    MatPaginatorModule,
    MatTableModule,
    MatDialogModule,
    MatCheckboxModule,
    MatGridListModule,
    MatListModule,
  ]
})


export class GenerarIndividualComponent implements OnInit {
  idiest:number;
  NombreA:string;

  constructor(){
    this.idiest = 0;
    this.NombreA ='';
  }

  async ngOnInit() {
    this.cargaBuscador();
  }
      /**
   * Obtiene la referencia del contenedor donde se cargará de forma perezosa el
   * componente BuscadorComponent
   */
      @ViewChild('buscadorEmpleados', { read: ViewContainerRef })
      buscadorEmpleados!: ViewContainerRef;
      @ViewChild('general', { read: ViewContainerRef })
      general!: ViewContainerRef;
        /**
   * Carga cargaBuscador de forma perezosa en el contenedor.
   */
   private async cargaBuscador(): Promise<void> {
    const { BuscadorComponent } = await import('../../buscador/buscador.component');
    if (this.buscadorEmpleados) {
      this.buscadorEmpleados.clear();
      const { instance } =
        this.buscadorEmpleados.createComponent(BuscadorComponent);
      instance.idPersonSeleccionado.subscribe({
        next: (idPersonSeleccionado: number) => {
          this.idiest = idPersonSeleccionado;
          console.log("idiest seleccionado:" + this.idiest)
          /* >>>> comentado pero hay que asignarlo <<<< */
          // this.formulario.controls.idPersonSolicitado.setValue(
          //   idPersonSeleccionado
          // );
        },
      });
    }
  }


}
