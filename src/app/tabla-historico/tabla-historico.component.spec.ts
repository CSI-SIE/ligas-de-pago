import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaHistoricoComponent } from './tabla-historico.component';

describe('TablaHistoricoComponent', () => {
  let component: TablaHistoricoComponent;
  let fixture: ComponentFixture<TablaHistoricoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaHistoricoComponent]
    });
    fixture = TestBed.createComponent(TablaHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
