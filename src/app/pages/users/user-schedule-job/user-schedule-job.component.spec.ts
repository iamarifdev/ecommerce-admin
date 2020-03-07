import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserScheduleJobComponent } from './user-schedule-job.component';

describe('UserScheduleJobComponent', () => {
  let component: UserScheduleJobComponent;
  let fixture: ComponentFixture<UserScheduleJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserScheduleJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserScheduleJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
