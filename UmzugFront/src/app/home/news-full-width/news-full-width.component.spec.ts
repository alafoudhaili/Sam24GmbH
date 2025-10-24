import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsFullWidthComponent } from './news-full-width.component';

describe('NewsFullWidthComponent', () => {
  let component: NewsFullWidthComponent;
  let fixture: ComponentFixture<NewsFullWidthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsFullWidthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsFullWidthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
