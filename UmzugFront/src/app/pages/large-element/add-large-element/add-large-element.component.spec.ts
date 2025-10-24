import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLargeElementComponent } from './add-large-element.component';

describe('AddLargeElementComponent', () => {
  let component: AddLargeElementComponent;
  let fixture: ComponentFixture<AddLargeElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLargeElementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLargeElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
