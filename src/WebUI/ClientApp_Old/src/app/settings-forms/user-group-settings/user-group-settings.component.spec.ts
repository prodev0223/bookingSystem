import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupSettingsComponent } from './user-group-settings.component';

describe('UserGroupSettingsComponent', () => {
  let component: UserGroupSettingsComponent;
  let fixture: ComponentFixture<UserGroupSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGroupSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGroupSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
