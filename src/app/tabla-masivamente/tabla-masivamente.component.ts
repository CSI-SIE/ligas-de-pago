import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResultadoBusquedaLigasPago } from '../shared/models/ResultadoBusquedaLigasPago.model';
import { CatalogosService } from '../services/catalogos.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-tabla-masivamente',
  templateUrl: './tabla-masivamente.component.html',
  styleUrls: ['./tabla-masivamente.component.scss'],
  standalone: true,
  imports:[
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
  ],
})
export class TablaMasivamenteComponent {
  private suscripciones: Subscription[];

  @Input() tipoTabla:number=0;
  @Input() resultados:any;
  @Input() tamanoTabla: string = '';
  @Input() pageSizeOptions= <any>[];
  @Input() public displayedColumns: any;
  @Input() filtro:string | any;
  @Input() idPerson:number | any;

  //tabla variables
  @ViewChild(MatTable) table: MatTable<any> | any;
  @ViewChild('paginador', {static: false}) paginator: MatPaginator | any;
  dataSource = new MatTableDataSource<any[]>();
  mostrarPaginador:boolean = false;

  constructor(public cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    public router: Router,
    private _catalogosService: CatalogosService
    ) {
      this.suscripciones = [];
    }

    reiniciar(){
      this.resultados = [];
    }

    editar(valor:any){
      this.router.navigateByUrl('/editar/' + valor['idRegistro']);
      //console.log('editar');
      //console.log(valor['idRegistro']);
    }


    aplicarFiltro(filterValue:any){
      this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
    }

    addData() {
      this.cdRef.detectChanges();
      //seteo los datos de la tabla despues de cargarse la vista y detecto los cambios
      ////console.log(this.resultadosPartidasExtraordinarias);
      //this.dataSource.data = this.resultadosPartidasExtraordinarias;
      this.dataSource = new MatTableDataSource<ResultadoBusquedaLigasPago[]>(this.resultados);
      this.cdRef.detectChanges();

      //luego renderiso la tabla para motrar el valor nuevo
      this.table.renderRows();
      //Despues de eso actualiza el paginador
      this.dataSource.paginator = this.paginator;
      this.cdRef.detectChanges();
    }

    ngAfterViewInit(): void {
      this.addData();
    }

    ngOnChanges(changes: SimpleChanges) {

      //2022-05-20 para ver que al cargar por primera vez la tabla se recargue para mostrar los resultados.
      try {

        let change = changes['resultados'];
        if(!change.firstChange){
        this.addData();
      }
      } catch (error) {

      }

      for(let propName in changes){
        let change = changes[propName];
        if(changes['filtro'])
        {
          this.dataSource.filter = change.currentValue;
        }
      }
    }
}
