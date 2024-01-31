import { CommonModule, NgFor } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription,switchMap } from 'rxjs';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { Fechas } from 'src/app/shared/models/Fechas.model';
import { Periodos } from 'src/app/shared/models/Periodos.model';
import { formularioFechas } from 'src/app/shared/models/formularios/formulario-fecha.model';
import { TablaHistoricoComponent } from 'src/app/tabla-historico/tabla-historico.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    NgFor,
    MatButtonModule,
    MatIconModule,
    TablaHistoricoComponent,
    MatProgressSpinnerModule,
    MatTableModule,
    MatCardModule,

  ]
})
export class HistorialComponent  implements OnInit,OnDestroy{

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  //Globales
  isDisabled: boolean = true;
  hayFechas: boolean = false;
  tocadoPerido:boolean = false;
  tocadoFecha:boolean = false;

  fechaSeleccionado = 0;

  //*** Tabla ***----------------------------------
  public filtro: string = '';
  private finalizaSubscripcionrecargarTabla: Subscription | any;
  showSpinner = false;
  clickBusqueda = false;
  sinResultados = false;
  resultados:any[] = [];

  pageSizeOptions = [50, 100, 200, 500];
  tamanoTabla = "w-sm-90 w-lg-70 w-xl-50";


  //Estos nombres cambian respecto a como lo mandan de la consulta
  public displayedColumnsGrupo = {
    columnas: {
      FechaExaPsicome: ['Fecha ExaPsicome'],
      nombreProspecto: ['Nombre del prospecto'],
      idProspecto: ['idProspecto'],
      fechaLigaGenerada: ['Fecha generada'],
      fechadepago:['Fecha de pago'],
      vencimiento:['Fecha de vencimiento'],
      MedioPago:['Medio de pago'],

      paraMostrar: [
      'nombreProspecto',
      'fechaLigaGenerada',
      'vencimiento',
      'fechadepago',
      'MedioPago',
      ]
    }

    };
  //--------tabla --------------------------------

  //Generador de reportes.
  rutaDelGeneradorDeReportes = "https://sie.iest.edu.mx/app/escolar/GeneraExcel2.php?";

  //Exportar a Excel -------------------
  public exportarExcel(){
  //--------------------------------------------------------------------------------------

    var idTipo = 1;
    var param = "query=exec ContraloriaNew.dbo.CON_LigasPagoListado "+ idTipo + ","+this.fechaSeleccionado;

    document.location.href = this.rutaDelGeneradorDeReportes + param;

    this.openSnackBar("Descargando... Por favor, revisa tu carpeta de descargas.");


  //--------------------------------------------------------------------------------------
  }

  public formularioFechas: FormGroup<formularioFechas>;
  private suscripciones: Subscription[];

  public efFecha: any = {
    idPeriodo: ''
  }

  public mvfFecha: any = {
    idPeriodo: {
      required: 'Debe proporcionar un periodo.',
    }
  }

  //catalogo de Periodos
  periodos: Periodos[] = [];

  //catalogo de Fechas
  fechas: Fechas[] = [];



  constructor(
    private _formBuilder: FormBuilder,
    private _catalogosService: CatalogosService,
    private _snackBar: MatSnackBar,) {

    this.suscripciones = [];

    this.formularioFechas = this._formBuilder.group(
      {
        idPeriodo: this._formBuilder.control<number | null>(
        null,
          [ Validators.required ]
        )
      });

    const observadorValidadorFormulario$ = this.formularioFechas.valueChanges
      .subscribe(datos => this.dcfFecha(datos));
    this.suscripciones.push(observadorValidadorFormulario$);
    this.dcfFecha();

  }

  buscarFechas(idPeriodoSeleccionado:any){



    this.fechas = [];
    this.tocadoPerido = true;
    //console.log(idPeriodoSeleccionado);
    const obtenerFechas$ = this._catalogosService.obtenerCatalogoPeriodo_o_Fecha(
      {
        idTipo:3, //Modificado 2024-01-29
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

  ngOnInit(): void {

    //Recarga la tabla siempre y cuando la respuesta en el servicio this._catalogosService
      //sea igual a 1, que se envía desde el detalle de la solicitud.
      this.finalizaSubscripcionrecargarTabla = this._catalogosService.recargarTabla$.subscribe((resp)=>{
        if(resp == 1){this.onSubmit(0);} });

      //======================================

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

  openSnackBar(mensjae:string) {
    this._snackBar.open(mensjae, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000
    });
  }

    onSubmit(idFechaExamen:any){
    this.filtro = '';
    this.showSpinner = true;
    this.tocadoFecha = true;

    this.resultados = []; //Limpio el resultado
    this.fechaSeleccionado = idFechaExamen;
    const buscaForm$ = this._catalogosService.obtenerListadoLigasDePago(
      {
        idTipo:1,
        idFechaExamen:idFechaExamen
      }
      ).subscribe(
      {
        next: (data) =>{

          this.resultados = data;
          //console.log(this.resultados);
          if(this.resultados.length<=0)
          {this.sinResultados = true;}
          else
          {this.sinResultados = false;}

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


  ngOnDestroy(): void {
    if (!environment.production) {
      console.info(this.suscripciones.length + (this.suscripciones.length > 1 ? ' suscripciones serán destruídas.' : ' suscripción será destruída.'));
    }
    this.suscripciones.forEach((suscripcion) => {
      suscripcion.unsubscribe();
    });
  }

  private dcfFecha(datos?: any): void {
    if (!this.formularioFechas) { return; }
    const formulario = this.formularioFechas;
    for (const campo in this.efFecha) {
      if (this.efFecha.hasOwnProperty(campo)) {
        // Limpia mensajes de error previos, de existir.
        this.efFecha[campo] = '';
        const control = formulario.get(campo);
        if (control && control.dirty && !control.valid) {
          const mensajes = this.mvfFecha[campo];
          for (const clave in control.errors) {
            if (control.errors.hasOwnProperty(clave)) {
              this.efFecha[campo] += mensajes[clave] + ' ';
            }
          }
        }
      }
    }
  }

  get fb() { return this.formularioFechas.controls; }

  disteClick(){
    this.clickBusqueda = true;
  }

  }


