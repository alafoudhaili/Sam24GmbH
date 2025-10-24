import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalLocationComponent } from './global-location.component';

describe('GlobalLocationComponent', () => {
  let component: GlobalLocationComponent;
  let fixture: ComponentFixture<GlobalLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalLocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
