import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsGridComponent } from './news-grid.component';

describe('NewsGridComponent', () => {
  let component: NewsGridComponent;
  let fixture: ComponentFixture<NewsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
