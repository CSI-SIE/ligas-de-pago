import { Component,Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

import { CommonModule, DatePipe } from '@angular/common';

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


  //Para convertir el formato de fecha
  pipe = new DatePipe('en-US');
  //----------------------------------

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

   fechagenerar = new FormControl();

   fechaVigencia: string | null;

  constructor(
    private _catalogosService: CatalogosService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,

  ){
    this.idiest = 0;
    this.NombreA ='';

    this.suscripciones=[];

    this.fechaVigencia = "";


  }

  openSnackBar(mensjae:string) {
    this._snackBar.open(mensjae, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000
    });
  }

  obtenerSeleccionado(idFechaExamen:any){
    this.fechaSeleccionado = idFechaExamen;
  }


  generar(){
    this.fechaVigencia = "";
    this.fechaVigencia = this.pipe.transform(this.fechagenerar.value, 'dd/MM/yyyy');
    if(this.fechaVigencia){
      const dialogRef$ = this.dialog.open(DialogConfirmationComponent,{
        width:'30%',
        disableClose:true,
        autoFocus:true
      });
      dialogRef$.afterClosed().subscribe(result=>{
        if(result == undefined){
          //console.log("cancelado");
        }
        else{
          //*** Se va a generar la liga */
          const genera$ = this._catalogosService.generarLigaIndividual(
            {
              idProspecto:this.idiest,
              fechaVigencia: this.fechaVigencia,
              ipRecibida:0
            }
          )
        .subscribe({
          next: (result:any) => {
            this.openSnackBar(result);

          },
          error: (error) => {
            console.warn(error);
          },
        });
        this.suscripciones.push(genera$);
        /*** Termina generar liga */

          }
        });
    }
    else{
      this.openSnackBar("Favor de especificar una fecha para la vigencia.");
    }
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
          /* >>>> comentado pero hay que asignarlo <<<< */
          // this.formulario.controls.idPersonSolicitado.setValue(
          //   idPersonSeleccionado
          // );
        },
      });
    }
  }


}
