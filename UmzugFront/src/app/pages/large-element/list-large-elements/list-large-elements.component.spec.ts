import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLargeElementsComponent } from './list-large-elements.component';

describe('ListLargeElementsComponent', () => {
  let component: ListLargeElementsComponent;
  let fixture: ComponentFixture<ListLargeElementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLargeElementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListLargeElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
