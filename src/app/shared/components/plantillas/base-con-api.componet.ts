import { Component, inject } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-base-con-api',
  template: '',
})
export class BaseConApiComponent {
  /**
   * Inyección de dependencias.
   */
  public matSnackBar = inject(MatSnackBar);

  /**
   * Arreglo de suscripciones. Cada suscripción realizada se almacena aquí para
   * que al salir del componente se proceda a cancelar las que continúen vigentes.
   */
  protected suscripciones: Subscription[];

  /**
   * Bandera para determinar si alguna petición no pudo completarse y así avisar
   * mediante una SnackBar al usuario.
   */
  protected errorConexion: boolean;

  /**
   * Bandera para identificar que existen peticiones en proceso.
   */
  protected muestraIndicadorCarga: boolean;

  /**
   * Referencia de la SnackBar si fue ejecutada.
   */
  protected snackBarGlobal: MatSnackBarRef<TextOnlySnackBar> | null;

  constructor() {
    this.suscripciones = [];
    this.errorConexion = false;
    this.muestraIndicadorCarga = false;
    this.snackBarGlobal = null;
  }

  /**
   * Procede a destruir todas las suscripciones que continúen aún vigentes.
   */
  protected limpiaSuscripcionesPendientes(): void {
    if (!environment.production) {
      if (this.suscripciones.length > 0) {
        console.info(
          this.suscripciones.length +
            (this.suscripciones.length > 1
              ? ' suscripciones serán destruídas.'
              : ' suscripción será destruída.')
        );
      } else {
        console.info('No existen suscripciones pendientes de cerrar.');
      }
    }
    if (this.snackBarGlobal) {
      this.cierraSnackBarGlobal();
    }
    this.suscripciones.forEach((suscripcion) => {
      suscripcion.unsubscribe();
    });
  }

  /**
   * Si la ejecución de la consulta a la API falla entonces muestra una SnackBar
   * que alerte al usuario que algo anda mal.
   */
  protected muestraMensajeErrorConexion(): void {
    this.matSnackBar.open(
      `Partes de esta página no se pueden mostrar y ciertos elementos podrían no
      funcionar correctamente. Actualiza la página e intentálo de nuevo.`.replace(
        /\s+/g,
        ' '
      ),
      '',
      {
        duration: 600000,
        horizontalPosition: 'left',
        verticalPosition: 'bottom',
      }
    );
  }

  /**
   * Usa la SnackBar global en lugar de abrir múltiples instancias. Útil, por
   * ejemplo, para no avisar múltiples veces un mismo mensaje.
   *
   * @param mensaje Mensaje a mostrar en la Snack Bar.
   * @param accion Texto que se mostrará en el botón de acción de la Snack Bar.
   * @param duracion Tiempo que se mostrará la Snack Bar antes de que se cierre
   *     sola. De forma predeterminada es 3s.
   */
  protected abreSnackBarGlobal(
    mensaje: string,
    accion = '',
    duracion = 3000
  ): void {
    let abreSnackBar = true;

    if (
      this.snackBarGlobal &&
      this.snackBarGlobal.instance.data.message === mensaje
    ) {
      abreSnackBar = false;
    }

    if (abreSnackBar) {
      this.snackBarGlobal = this.matSnackBar.open(mensaje, accion, {
        duration: duracion,
        horizontalPosition: 'left',
        verticalPosition: 'bottom',
      });
      this.snackBarGlobal.afterDismissed().subscribe({
        next: () => (this.snackBarGlobal = null),
      });
    }
  }

  /**
   * Deshazte de la SnackBar global si es que aún queda abierta cuando el usuario
   * abandone el componente.
   */
  protected cierraSnackBarGlobal(): void {
    if (this.snackBarGlobal) {
      this.snackBarGlobal.dismiss();
      this.snackBarGlobal = null;
    }
  }
}
