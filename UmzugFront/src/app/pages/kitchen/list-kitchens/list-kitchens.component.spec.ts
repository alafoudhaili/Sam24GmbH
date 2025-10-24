import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListKitchensComponent } from './list-kitchens.component';

describe('ListKitchensComponent', () => {
  let component: ListKitchensComponent;
  let fixture: ComponentFixture<ListKitchensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListKitchensComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListKitchensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
