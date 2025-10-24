import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsRightSidebarComponent } from './news-right-sidebar.component';

describe('NewsRightSidebarComponent', () => {
  let component: NewsRightSidebarComponent;
  let fixture: ComponentFixture<NewsRightSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsRightSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsRightSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
