import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsLeftSidebarComponent } from './news-left-sidebar.component';

describe('NewsLeftSidebarComponent', () => {
  let component: NewsLeftSidebarComponent;
  let fixture: ComponentFixture<NewsLeftSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsLeftSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsLeftSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
