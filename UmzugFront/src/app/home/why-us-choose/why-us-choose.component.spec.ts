import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyUsChooseComponent } from './why-us-choose.component';

describe('WhyUsChooseComponent', () => {
  let component: WhyUsChooseComponent;
  let fixture: ComponentFixture<WhyUsChooseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhyUsChooseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyUsChooseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
