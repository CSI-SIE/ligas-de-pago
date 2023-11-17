import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable()
export class UtilidadesService {
  /**
   * Revisa si un campo del formulario es requerido o no de forma dinámica.
   *
   * @param {ValidatorFn} validator El validador del control a revisar.
   * @returns Verdadero si el control es requerido.
   */
  esRequerido(validator: ValidatorFn): boolean {
    const campoAnalizado = validator ? validator({} as AbstractControl) : false;
    if (campoAnalizado && campoAnalizado['required']) {
      return true;
    }
    return false;
  }

  /**
   * Transforma los campos con cadenas vacías a null y elimina los espacios
   * extras.
   *
   * @param conjuntoDatos Arreglo con el conjunto de datos a procesar.
   * @param compruebaCamposSeleccion Si es definido revisa si el MatSelect tiene
   *     como valor -17 y lo establece a null. -17 es el valor que internamente
   *     uso para hacer referencia a que es el campo predeterminado.
   * @returns Un nuevo conjunto de datos con un poco menos de caracteres basura.
   */
  limpiaConjuntoDatos(
    conjuntoDatos: any,
    compruebaCamposSeleccion = false
  ): any {
    Object.keys(conjuntoDatos).map((k) => {
      const valor = conjuntoDatos[k];
      if (typeof valor === 'string') {
        let valorTmp: any = valor.trim();
        if (valorTmp === '') {
          valorTmp = null;
        }
        conjuntoDatos[k] = valorTmp;
      } else if (compruebaCamposSeleccion && valor === -17) {
        conjuntoDatos[k] = null;
      }
    });
    return conjuntoDatos;
  }

  /**
   * Verifica si el conjunto de datos contiene algún dato relevante. Ejemplo:
   * ```
   * // Retorna false porque al menos 1 valor contiene información significante.
   * this._utilidadesService.sonTodosLosCamposNulos([
   *    valorA, // null
   *    valorB, // 'Guayaba'
   *    valorC  // null
   * ]);
   * ```
   *
   * @param {any} conjuntoDatos Arreglo con el conjunto de datos a analizar.
   * @returns Verdadero si en el arreglo sólo hay valores null.
   */
  sonTodosLosCamposNulos(conjuntoDatos: any): boolean {
    return conjuntoDatos.every((valor: any) => valor === null);
  }

  /**
   * Transforma un objeto Date a cadena en formato ISO.
   *
   * @param fecha Fecha a transformar.
   * @returns Una cadena que representa la fecha proporcionada en formato ISO.
   */
  transformaAFechaISO(fecha: Date): string {
    /*
     * Primero se especifica la representación de cada parte de la fecha y la
     * zona geográfica.
     */
    const opciones: any = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      timeZone: 'America/Monterrey',
    };
    /*
     * Después se transforma a la notación de un país que respete el estándar
     * ISO 8601 como lo es Suecia. Otros que pudieron servir para la ocasión se
     * pueden encontrar aquí: https://en.wikipedia.org/wiki/ISO_8601
     */
    const fechaEnFormatoISO = new Intl.DateTimeFormat('sv-SE', opciones)
      .format(fecha)
      .replace(' ', 'T');
    return fechaEnFormatoISO;
  }

  /**
   * Genera una especie de UUID a medida. No me interesa que sea la gran cosa;
   * tan sólo que evite que si el mismo mensaje ocurre en secuencia no permita
   * que se agrupen, para así poder identificarlos más rápido.
   *
   * @returns Una especie de UUID.
   */
  obtenUUID(): string {
    return String(Math.floor(Math.random() * Date.now())).slice(-5);
  }

  /**
   * Crea un mensaje en consola que sólo se mostrará si se está en ambiente de
   * pruebas.
   *
   * @param mensaje El mensaje a mostrar.
   */
  muestraMensajeDepuracion(mensaje: string): void {
    if (!environment.production) {
      console.info(`(${this.obtenUUID()}): ${mensaje}`);
    }
  }

  /**
   * Almacena en local el último estado del componente para que se vuelva a
   * cargar en cuanto regrese.
   *
   * @param componente Nombre del componente.
   * @param estado Último valor. Puede ser cualquier cosa. Un ejemplo sería un
   *     objeto con los últimos parámetros de la búsqueda.
   * @param modulo Nombre del proyecto para que en LocalStorage no se repita.
   */
  conservaUltimoEstado(
    componente: string,
    estado: any,
    modulo: string = environment.project
  ): void {
    // Obtiene del almacenamiento local todo lo referente a este módulo.
    let datosDelModulo: any = localStorage.getItem(modulo);
    /*
     * Si no se tiene registro alguno, entonces inicializa un objeto para
     * trabajar con él.
     */
    if (datosDelModulo) {
      datosDelModulo = JSON.parse(datosDelModulo);
    } else {
      datosDelModulo = {};
    }
    /*
     * Si existe un estado previo para el componente seleccionado entonces
     * conserva lo actual y fusiona la nueva información.
     */
    if (Object.hasOwnProperty.call(datosDelModulo, componente)) {
      datosDelModulo[componente] = { ...datosDelModulo[componente], ...estado };
    } else {
      datosDelModulo[componente] = estado;
    }
    // Ahora sí, escribe en el almacenamiento local los cambios.
    localStorage.setItem(modulo, JSON.stringify(datosDelModulo));
  }

  /**
   * Si se especifica un componente se recupera el último estado del mismo de lo
   * contrario se devuelven todos los datos almacenados.
   *
   * @param componente Nombre del componente.
   * @param modulo Nombre del proyecto para que en LocalStorage no se repita.
   * @returns Un elemento de cualquier tipo o nulo si no existe un estado previo.
   */
  recuperaUltimoEstado(
    componente?: string,
    modulo: string = environment.project
  ): any {
    let datosDelModulo: any = localStorage.getItem(modulo);
    if (datosDelModulo) {
      datosDelModulo = componente
        ? JSON.parse(datosDelModulo)[componente]
        : JSON.parse(datosDelModulo);
    }
    return datosDelModulo;
  }

  /**
   * Si se proporciona un componente se descarta su último estado. En caso
   * contrario, se descarta todo el conjunto de datos de la aplicación.
   *
   * @param componente Nombre del componente.
   * @param modulo Nombre del proyecto para que en LocalStorage no se repita.
   */
  descartaUltimoEstado(
    componente?: string,
    modulo: string = environment.project
  ): void {
    const datosDelModulo = this.recuperaUltimoEstado();
    if (componente && datosDelModulo) {
      delete datosDelModulo[componente];
    }
    if (
      componente &&
      datosDelModulo &&
      Object.keys(datosDelModulo).length > 0
    ) {
      localStorage.setItem(modulo, JSON.stringify(datosDelModulo));
    } else {
      localStorage.removeItem(modulo);
    }
  }

  /**
   * Se obtiene el identificador del rol actual del actor desde LocalStorage.
   *
   * @returns el identificador del rol que está ejerciendo el usuario.
   */
  recuperaRol(): number {
    const recuperaEstado = this.recuperaUltimoEstado('AppComponent');
    return JSON.parse(recuperaEstado.personalidad).idRol;
  }
}
