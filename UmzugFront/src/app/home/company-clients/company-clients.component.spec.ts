import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyClientsComponent } from './company-clients.component';

describe('CompanyClientsComponent', () => {
  let component: CompanyClientsComponent;
  let fixture: ComponentFixture<CompanyClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyClientsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
