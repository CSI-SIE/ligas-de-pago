import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { environment } from 'src/environments/environment';
import { Subscription, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { formularioBuscador } from 'src/app/shared/models/formularios/formulario-buscador.model';
import { Buscador81 } from '../shared/models/Buscador81Prospectos.model';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [CommonModule,
            MatAutocompleteModule,
            MatButtonModule,
            MatIconModule,
            MatInputModule,
            ReactiveFormsModule,
          ],
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.scss']
})
export class BuscadorComponent implements OnInit {

  @Output() idPersonSeleccionado = new EventEmitter();

  @ViewChild('buscador') buscador!: ElementRef;

  private suscripciones: Subscription[];
  public muestraBuscador: boolean;
  public formularioBuscador: FormGroup<formularioBuscador>;
  public listadoAlumnosFiltrados: Buscador81[];

  public efBuscador: any = {
    palabraClave: '',
    idPerson: ''
  }

  public mvfBuscador: any = {
    palabraClave: {
      required: 'Debe proporcionar una palabra clave.'
    },
    idPerson: {
      required: 'Debe ingresar un idPerson.',
    }
  }

  constructor(

    private _router: Router,
    private _formBuilder: FormBuilder,
    private _catalogosService: CatalogosService) {

    this.suscripciones = [];
    this.muestraBuscador = true;

    this.listadoAlumnosFiltrados = [];

    this.formularioBuscador = this._formBuilder.group(
      {
        palabraClave: this._formBuilder.control<string | null>(
          null,
          []
        ),
        idPerson: this._formBuilder.control<number | null>(
        null,
          [ Validators.required ]
        )
      });

    const observadorValidadorFormulario$ = this.formularioBuscador.valueChanges
      .subscribe(datos => this.dcfBuscador(datos));
    this.suscripciones.push(observadorValidadorFormulario$);
    this.dcfBuscador();

    const PER_BuscadoresPersonas$ = this.formularioBuscador.controls.palabraClave.valueChanges
    .pipe(
      debounceTime(350),
      distinctUntilChanged(),
      filter(valor => typeof valor === 'string'),
      tap(
        () => {
          this.fb.idPerson.setValue(null);
        }
      ),
      switchMap(
        (palabraClave) =>
        this._catalogosService.PER_BuscadoresPersonas(
          {
            indicador: palabraClave ?? '',

          }
        )
      )
    )
    .subscribe({
      next: (listadoAlumnos) => {
        if(Object.hasOwnProperty.call(listadoAlumnos, 'success')) {
          this._router.navigate(['/debe-iniciar-sesion-SIE']);
        } else {
          this.listadoAlumnosFiltrados = listadoAlumnos;
        }
      },
      error: (error) => {
        console.warn(error);
        alert('Ocurrio un error al procesar la solicitud');
      },
    });
    this.suscripciones.push(PER_BuscadoresPersonas$);
  }


  ngOnInit(): void {


  }

  ngOnDestroy(): void {
    if (!environment.production) {
      console.info(this.suscripciones.length + (this.suscripciones.length > 1 ? ' suscripciones serán destruídas.' : ' suscripción será destruída.'));
    }
    this.suscripciones.forEach((suscripcion) => {
      suscripcion.unsubscribe();
    });
  }

  private dcfBuscador(datos?: any): void {
    if (!this.formularioBuscador) { return; }
    const formulario = this.formularioBuscador;
    for (const campo in this.efBuscador) {
      if (this.efBuscador.hasOwnProperty(campo)) {
        // Limpia mensajes de error previos, de existir.
        this.efBuscador[campo] = '';
        const control = formulario.get(campo);
        if (control && control.dirty && !control.valid) {
          const mensajes = this.mvfBuscador[campo];
          for (const clave in control.errors) {
            if (control.errors.hasOwnProperty(clave)) {
              this.efBuscador[campo] += mensajes[clave] + ' ';
            }
          }
        }
      }
    }
  }

  get fb() { return this.formularioBuscador.controls; }

  public compruebaAlumno(): void {
      const coincidencias = this.listadoAlumnosFiltrados.filter(
        (alumno) => alumno.idprospecto === this.fb.idPerson.value);

      if (coincidencias.length === 0) {
        this.fb.idPerson.setValue(null);
      }
  }

  public obtenNombreAlumno(alumnoSeleccionado: Buscador81): string {
    if (!alumnoSeleccionado) {
      return '';
    }

    const clave = this.listadoAlumnosFiltrados.findIndex(
      (alumno) => alumno.idprospecto === alumnoSeleccionado.idprospecto);
    return this.listadoAlumnosFiltrados[clave].nombreCompleto.trim();
  }

  public estableceIdIEST(alumnoSeleccionado: Buscador81): void {
    setTimeout(
      () => {
        this.buscador.nativeElement.blur();
        // this.selectTipoSolicitud.focus();
    }, 357);
    this.fb.idPerson.setValue(alumnoSeleccionado.idprospecto);
    this.idPersonSeleccionado.emit(this.fb.idPerson.value);
  }

  public limpiarBuscador(): void {
    this.formularioBuscador.controls.palabraClave.setValue(null);
    this.fb.idPerson.setValue(null);
    this.listadoAlumnosFiltrados = [];
    this.idPersonSeleccionado.emit(null);
  }
}
