import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOrganizationChartComponent } from './user-organization-chart.component';

describe('UserOrganizationChartComponent', () => {
  let component: UserOrganizationChartComponent;
  let fixture: ComponentFixture<UserOrganizationChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserOrganizationChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOrganizationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
