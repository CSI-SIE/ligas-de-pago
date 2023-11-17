import { Component,Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
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
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { Observable, Subscription, map, startWith } from 'rxjs';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { Fechas } from 'src/app/shared/models/Fechas.model';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { DialogConfirmationComponent } from 'src/app/dialog-confirmation/dialog-confirmation.component';


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
    MatSelectModule
  ]
})


export class GenerarIndividualComponent implements OnInit {

  fechaSeleccionado = 0;

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  idiest:number;
  NombreA:string;

  showSpinner = false;
  clickBusqueda = false;
  sinResultados = false;

   //catalogo de Fechas
   fechas: Fechas[] = [];

   private suscripciones: Subscription[];

  constructor(
    private _catalogosService: CatalogosService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ){
    this.idiest = 0;
    this.NombreA ='';

    this.suscripciones=[];
  }

  openSnackBar(mensjae:string) {
    this._snackBar.open(mensjae, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000
    });
  }

  buscarFechas(){

    this.fechas = [];
    //this.tocadoPerido = true;
    console.log("entró a buscarFechas");
    const obtenerFechas$ = this._catalogosService.obtenerCatalogoPeriodo_o_Fecha(
      {
        idTipo:1,
        idPeriodo:101
      }
    )
  .subscribe({
    next: (fechas:any) => {
      console.log(fechas);

      this.fechas = fechas;

      if(this.fechas.length>0){
        //this.isDisabled = false;
        //this.hayFechas = true;
       }
       else{
        this.openSnackBar("No hay fechas en este periodo.");
        //this.hayFechas = false;
        //this.isDisabled = true;
       }

    },
    error: (error) => {
      console.warn(error);
      //alert('Ocurrio un error al procesar la solicitud');
    },
  });
  this.suscripciones.push(obtenerFechas$ );
  }

  obtenerSeleccionado(idFechaExamen:any){
    this.fechaSeleccionado = idFechaExamen;
  }

  generar(){
    const dialogRef$ = this.dialog.open(DialogConfirmationComponent,{
      width:'30%',
      disableClose:true,
      autoFocus:true
    });
    dialogRef$.afterClosed().subscribe(result=>{
      if(result == undefined){
        console.log("cancelado");
      }
      else{
        //*** Se va a generar la liga */
        console.log("Se va a mandar prospoecto: " + 74401);
        console.log("Se va a mandar idFecha: " + '17/11/2023');

        const genera$ = this._catalogosService.generarLigaIndividual(
          {
            idProspecto:74401,//this.idiest,
            fechaVigencia:'17/11/2023', //this.fechaSeleccionado,
            ipRecibida:0
          }
        )
      .subscribe({
        next: (result:any) => {
          console.log(result);
        },
        error: (error) => {
          console.warn(error);
        },
      });
      this.suscripciones.push(genera$ );
      /*** Termina generar liga */

        }
      });
  }


  async ngOnInit() {
    this.cargaBuscador();
    this.buscarFechas();
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
