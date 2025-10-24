import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UmzugFormularComponent } from './UmzugFormular.component';

describe('UmzugFormularComponent', () => {
  let component: UmzugFormularComponent;
  let fixture: ComponentFixture<UmzugFormularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UmzugFormularComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UmzugFormularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
