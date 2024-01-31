import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaMasivamenteComponent } from './tabla-masivamente.component';

describe('TablaMasivamenteComponent', () => {
  let component: TablaMasivamenteComponent;
  let fixture: ComponentFixture<TablaMasivamenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaMasivamenteComponent]
    });
    fixture = TestBed.createComponent(TablaMasivamenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
