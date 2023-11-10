import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarIndividualComponent } from './generar-individual.component';

describe('GenerarIndividualComponent', () => {
  let component: GenerarIndividualComponent;
  let fixture: ComponentFixture<GenerarIndividualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerarIndividualComponent]
    });
    fixture = TestBed.createComponent(GenerarIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
