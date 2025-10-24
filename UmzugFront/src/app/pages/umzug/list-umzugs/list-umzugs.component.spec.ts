import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUmzugsComponent } from './list-umzugs.component';

describe('ListElementsComponent', () => {
  let component: ListUmzugsComponent;
  let fixture: ComponentFixture<ListUmzugsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListUmzugsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListUmzugsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
