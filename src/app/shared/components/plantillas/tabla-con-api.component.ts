import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { UtilidadesService } from 'src/app/services/utilidades.service';

import { BaseConApiComponent } from './base-con-api.componet';///base-con-api.component

import { ColumnaTabla } from '../../models/columna-tabla.model';

@Component({
  selector: 'app-tabla-con-api',
  template: '',
})
export abstract class TablaConApiComponent extends BaseConApiComponent {
  /**
   * Inyección de dependencias.
   */
  public override matSnackBar = inject(MatSnackBar);
  public breakpointObserver = inject(BreakpointObserver);
  public utilidadesService = inject(UtilidadesService);

  /**
   * Referencia al elemento creado por MatPaginator.
   */
  @ViewChild(MatPaginator, { static: false }) set paginadorTabla(
    paginador: MatPaginator
  ) {
    if (this.tabla) {
      this.tabla.paginator = paginador;
    }
  }
  /**
   * Referencia al elemento creado por MatSort.
   */
  @ViewChild(MatSort, { static: false }) set ordenamientoTabla(
    ordenador: MatSort
  ) {
    if (this.tabla) {
      this.tabla.sort = ordenador;
    }
  }
  /**
   * Referencia al cuadro de texto usado para filtrar el contenido de la tabla.
   */
  @ViewChild('campoFiltradoTabla') campoFiltradoTabla!: ElementRef;

  abstract componente: string;

  /**
   * Variable para recuperar un estado o "snapshot' del componente desde
   * LocalStorage.
   */
  private estadoPrevioComponente: any;

  /**
   * Estructura de las columnas con sus propiedades de visibilidad.
   */
  abstract columnasTabla: ColumnaTabla[];

  /**
   * Registro de movimientos en la solicitud seleccionada.
   */
  abstract tabla: MatTableDataSource<any>;

  /**
   * Referencia al elemento Interval.
   */
  protected intervaloActualizacionResultados: number | undefined;

  /**
   * Cantidad de elementos que mostrará un página de la tabla dependiendo de la
   * resolución de la ventana.
   */
  protected cantidadElementosPaginaTabla: number | null;

  /**
   * Observador para vigilar los cambios de tamaño de pantalla.
   */
  private readonly breakpoint$: Observable<BreakpointState>;

  constructor() {
    super();

    this.cantidadElementosPaginaTabla = null;

    this.breakpoint$ = this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
      Breakpoints.TabletPortrait,
      Breakpoints.WebPortrait,
      Breakpoints.TabletLandscape,
      Breakpoints.WebLandscape,
    ]);
  }

  /**
   * Verifica el esquema de la tabla y devuelve aquellas columnas que no se
   * hayan marcado como ocultas.
   *
   * @returns Un arreglo que contiene el nombre de las columnas a mostrar.
   */
  protected obtenColumnasDisponibles(): string[] {
    return this.columnasTabla.filter((cd) => !cd.oculto).map((cd) => cd.campo);
  }

  /**
   * Realiza un filtrado en el modelo de la tabla usando las palabras claves
   * proporcionadas.
   *
   * @param evento Valor del cuadro de texto usado como buscador.
   */
  protected filtra = (evento?: Event) => {
    let palabrasClave;
    if (evento) {
      palabrasClave = (evento.target as HTMLInputElement).value;
    } else {
      this.campoFiltradoTabla.nativeElement.value = '';
      palabrasClave = '';
    }
    this.tabla.filter = palabrasClave.trim().toLocaleLowerCase();
  };

  /**
   * Recupera el estado previo del componente. Es decir, alguna configuración
   * que haya sido guardada en LocalStorage como por ejemplo la cantidad de
   * elementos a mostrar de forma predeterminada en una página de la tabla.
   */
  protected obtenEstadoPrevioDelComponente(): void {
    this.estadoPrevioComponente = this.utilidadesService.recuperaUltimoEstado(
      this.componente
    );
    if (this.estadoPrevioComponente) {
      if (
        Object.hasOwnProperty.call(
          this.estadoPrevioComponente,
          'longitudPagina'
        )
      ) {
        this.utilidadesService.muestraMensajeDepuracion(
          `El usuario estableció previamente que desea una tabla con longitud
          ${this.estadoPrevioComponente.longitudPagina} por
          lo que no se adaptará.`.replace(/\s+/g, ' ')
        );
        const esperaPaginador = setInterval(() => {
          if (!environment.production && this.tabla.data.length > 0) {
            console.info(
              `(${this.utilidadesService.obtenUUID()}): Esperando paginador...`
            );
          }
          if (this.tabla.paginator) {
            (this.tabla.paginator as MatPaginator)._changePageSize(
              this.estadoPrevioComponente.longitudPagina
            );
            clearInterval(esperaPaginador);
          }
        }, 100);
      }
    } else {
      this.breakpoint$.subscribe(() => {
        this.actualizaPaginadorTabla();
      });
    }
  }

  /**
   * Actualiza el tamaño de la página de la tabla para que se ajuste al tamaño
   * de la pantalla.
   */
  private actualizaPaginadorTabla(): void {
    if (this.tabla.paginator) {
      if (
        this.breakpointObserver.isMatched([
          Breakpoints.TabletPortrait,
          Breakpoints.WebPortrait,
        ])
      ) {
        this.utilidadesService.muestraMensajeDepuracion(
          'La cantidad de elementos por página en pantallas verticales es 10.'
        );
        (this.tabla.paginator as MatPaginator)._changePageSize(10);
      } else if (
        this.breakpointObserver.isMatched([
          Breakpoints.Large,
          Breakpoints.XLarge,
          Breakpoints.WebLandscape,
        ])
      ) {
        this.utilidadesService.muestraMensajeDepuracion(
          `La cantidad de elementos por página en pantallas de más de 1279.98px
          en horizontal es 5.`.replace(/\s+/g, ' ')
        );
        (this.tabla.paginator as MatPaginator)._changePageSize(5);
      } else if (
        this.breakpointObserver.isMatched([
          Breakpoints.XSmall,
          Breakpoints.Small,
          Breakpoints.Medium,
        ])
      ) {
        this.utilidadesService.muestraMensajeDepuracion(
          `La cantidad de elementos por página en pantallas de menos de
          1279.98px en horizontal es 3.`.replace(/\s+/g, ' ')
        );
        (this.tabla.paginator as MatPaginator)._changePageSize(3);
      }
    } else {
      setTimeout(() => {
        if (!environment.production && this.tabla.data.length > 0) {
          console.info(
            `(${this.utilidadesService.obtenUUID()}): Esperando paginador...`
          );
        }
        this.actualizaPaginadorTabla();
      }, 100);
    }
  }

  /**
   * Conserva el tamaño de página que el usuario prefiere para la tabla de
   * avance de reinscripciones.
   *
   * @param evento Evento que se dispara al cambiar el tamaño de la página.
   */
  protected procesaCambioLongitudPagina(evento: PageEvent): void {
    if (this.cantidadElementosPaginaTabla !== evento.pageSize) {
      this.utilidadesService.muestraMensajeDepuracion(
        `El nuevo tamaño inicial del paginador ahora será: ${evento.pageSize}.`
      );
      this.utilidadesService.conservaUltimoEstado(this.componente, {
        longitudPagina: evento.pageSize,
      });
      this.cantidadElementosPaginaTabla = evento.pageSize;
    }
  }
}
