import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable, Subscription, firstValueFrom, map } from 'rxjs';
import { DialogConfirmationComponent } from 'src/app/dialog-confirmation/dialog-confirmation.component';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { Fechas } from 'src/app/shared/models/Fechas.model';
import { Periodos } from 'src/app/shared/models/Periodos.model';
import { environment } from 'src/environments/environment';
import { ProgressBarMode, MatProgressBarModule } from '@angular/material/progress-bar';
import { TablaMasivamenteComponent } from 'src/app/tabla-masivamente/tabla-masivamente.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'generar-de-listado',
  templateUrl: './generar-de-listado.component.html',
  styleUrls: ['./generar-de-listado.component.scss'],
  standalone: true,
  imports:[
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    NgFor,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatCardModule,
    MatProgressBarModule,
    TablaMasivamenteComponent
  ]
})

export class GenerarDeListadoComponent implements OnInit {

  selectDeFechas = "";
  //Progress bar
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 0;
  bufferValue = 75;
  //------------

  //Para convertir el formato de fecha
  pipe = new DatePipe('en-US');
  //----------------------------------

  fechagenerar = new FormControl();

  private suscripciones: Subscription[];
  fechaVigencia: string | null;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  //Globales
  isDisabled: boolean = true;
  hayFechas: boolean = false;
  tocadoPerido:boolean = false;
  tocadoFecha:boolean = false;
  buttonDisabled:boolean = true;

  //*** Tabla ***----------------------------------
  public filtro: string = '';
  private finalizaSubscripcionrecargarTabla: Subscription | any;
  showSpinner = false;
  clickBusqueda = false;
  sinResultados = false;
  resultados:any[] = [];

  ligasProcesadasRespuesta:any[] = [];

  pageSizeOptions = [100, 200, 500, 1000];
  tamanoTabla = "w-sm-90 w-lg-70 w-xl-50";

  //Estos nombres cambian respecto a como lo mandan de la consulta
  public displayedColumnsGrupo = {
    columnas: {
      nombreProspecto: ['Nombre del prospecto'],
      mensaje: ['Respuesta'],
      paraMostrar: [
      'nombreProspecto',
      'mensaje',
      ]
    }

    };
  //--------tabla --------------------------------

  fechaSeleccionado = 0;

   //catalogo de Periodos
   periodos: Periodos[] = [];

   //catalogo de Fechas
   fechas: Fechas[] = [];

   procesados: any[] = [];

  resetSelect(){
    this.selectDeFechas = "";
    this.resultados = [];
    this.tocadoFecha = false;
  }

  //progress$: Observable<number>
  progress$: Observable<Array<number[]>> = new Observable<Array<number[]>>();

  constructor(
    private _catalogosService: CatalogosService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,

  ){

    this.suscripciones=[];

    this.fechaVigencia = "";
  }

  ngOnInit(): void {

      const sesion$ = this._catalogosService.obtenerCatalogoPeriodo_o_Fecha(
        {
          idTipo:2,
          idPeriodo:0
        }
      ).subscribe(
        {
          next:(data: any) =>{
          //console.log(data);
           this.periodos = data;

           //console.log(this.periodos);
        },
          error: (errores) =>{
            console.error(errores);
          }
        }
      );
      this.suscripciones.push(sesion$);
      //=====================================
  }

  generar(){

    //Validar this.idiest  (Prospecto)

    this.showSpinner = true;
    //this.fechaVigencia = this.pipe.transform(this.fechagenerar.value, 'dd/MM/yyyy');
    if(this.fechaSeleccionado){
      const dialogRef$ = this.dialog.open(DialogConfirmationComponent,{
        width:'30%',
        disableClose:true,
        autoFocus:true
      });
      dialogRef$.afterClosed().subscribe(async result=>{
        if(result == undefined){
          //console.log("cancelado");
          this.showSpinner = false;
        }
        else{

          //console.log(this.showSpinner);
          // var vueltas = 0;
          this.ligasProcesadasRespuesta = [];



            for await (let element of this.resultados){
              await this.cicloGerarLigas(element['idProspecto']);
              //console.log(element);
            }


          // this.resultados.forEach(async element => {
          //    await this.cicloGerarLigas(element['idProspecto']);

          //     vueltas++;
          // });

          // var total = 300;
          // var prospectooo = 10;
          // for (let index = 0; index <total; index++) {
          //   this.cicloGerarLigas(prospectooo);
          //   vueltas++;
          // }

          // ***Se detiene el spinner
          this.showSpinner = false;
          this.buttonDisabled = true;
          this.resultados = [];
          this.resultados = this.ligasProcesadasRespuesta;
          //this.tocadoFecha = false;

          this.openSnackBar("Se han generado las ligas de pago.");


              //*** Cliclo para recorrer todos y cada uno de los prospectos a los cuales se les va a generar una liga de pago */
              // this.resultados.forEach(element => {
              //   console.log(element['idProspecto']);
              //   const genera$ = this._catalogosService.generarLigaMasivamente(
              //     {
              //       idProspecto: element['idProspecto'],//this.idiest,
              //       idFechaExamen: this.fechaSeleccionado,
              //       ipRecibida:0
              //     }
              //   )
              // .subscribe({
              //   next: (result:any) => {
              //     this.openSnackBar(result.mensaje);
              //     this.procesados.push(result);
              //     this.showSpinner = false;
              //   },
              //   error: (error) => {
              //     this.showSpinner = false;
              //     console.warn(error);
              //   },
              // });
              // this.suscripciones.push(genera$ );
              // });
              /*** Termina ciclo */

            //============================================================================
            //Validar cuando detener el spinner---
            //this.showSpinner = false;
            //------------------------------------
            //============================================================================

            //this.procesados.forEach(element => {
              // console.log( '=== PROCESADOS ===');
              //  console.log( element.mensaje);
            //});

          }
        });
    }
    else{
      this.openSnackBar("Favor de especificar una fecha.");
    }
  }

  async cicloGerarLigas(prospecto:any) {

     //console.log(prospecto);
      //console.log(element['idProspecto']);
      const genera$ = await firstValueFrom(this._catalogosService.generarLigaMasivamente(
          {
              idProspecto: prospecto,//this.idiest,
              idFechaExamen: this.fechaSeleccionado,
              ipRecibida:0
          }
        ));
        this.ligasProcesadasRespuesta.push(genera$[0]);
  }

  buscarFechas(idPeriodoSeleccionado:any){
    this.buttonDisabled = true;
    this.fechas = [];
    this.tocadoPerido = true;
    //console.log(idPeriodoSeleccionado);
    this.resetSelect();

    const obtenerFechas$ = this._catalogosService.obtenerCatalogoPeriodo_o_Fecha(
      {
        idTipo:1,
        idPeriodo:idPeriodoSeleccionado
      }
    )
  .subscribe({
    next: (fechas:any) => {
      //console.log(fechas);

      this.fechas = fechas;

      if(this.fechas.length>0){
        this.isDisabled = false;
        this.hayFechas = true;
       }
       else{
        this.hayFechas = false;
        this.isDisabled = true;
       }

    },
    error: (error) => {
      console.warn(error);
      //alert('Ocurrio un error al procesar la solicitud');
    },
  });
  this.suscripciones.push(obtenerFechas$ );
  }


  openSnackBar(mensjae:string) {
    this._snackBar.open(mensjae, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000
    });
  }

  onSubmit(idFechaExamen:any){
    this.showSpinner = true;
    this.tocadoFecha = true;
    this.buttonDisabled = true;
    //console.log('obtenerListadoLigasDePagoMasivo');
    this.resultados = []; //Limpio el resultado
    this.fechaSeleccionado = idFechaExamen;
    const buscaForm$ = this._catalogosService.obtenerListadoLigasDePagoMasivo(
      {
        idTipo:1,
        idFechaExamen:idFechaExamen
      }
      ).subscribe(
      {
        next: (data) =>{

          this.resultados = data;


          console.log(this.resultados);
          if(this.resultados.length<=0)
          {this.sinResultados = true;}
          else
          {
            this.sinResultados = false;
            this.buttonDisabled = false;
          }
        },
        error: (errores) => {
          console.error(errores);
          this.showSpinner = false;
        },
        complete:() =>{
          this.showSpinner = false;
        }
      }
    );
    this.suscripciones.push(buscaForm$);
  }

  disteClick(){
    this.clickBusqueda = true;
  }

  ngOnDestroy(): void {
    if (!environment.production) {
      console.info(this.suscripciones.length + (this.suscripciones.length > 1 ? ' suscripciones serán destruídas.' : ' suscripción será destruída.'));
    }
    this.suscripciones.forEach((suscripcion) => {
      suscripcion.unsubscribe();
    });
  }

}
