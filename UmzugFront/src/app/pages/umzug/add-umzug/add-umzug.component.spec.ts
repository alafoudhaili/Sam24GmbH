import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUmzugComponent } from './add-umzug.component';

describe('AddElementComponent', () => {
  let component: AddUmzugComponent;
  let fixture: ComponentFixture<AddUmzugComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUmzugComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUmzugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
