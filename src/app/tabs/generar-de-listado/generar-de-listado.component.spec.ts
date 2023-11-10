import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarDeListadoComponent } from './generar-de-listado.component';

describe('GenerarDeListadoComponent', () => {
  let component: GenerarDeListadoComponent;
  let fixture: ComponentFixture<GenerarDeListadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerarDeListadoComponent]
    });
    fixture = TestBed.createComponent(GenerarDeListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
