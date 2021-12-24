import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailsSettingsComponent } from './user-details-settings.component';

describe('UserDetailsSettingsComponent', () => {
  let component: UserDetailsSettingsComponent;
  let fixture: ComponentFixture<UserDetailsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDetailsSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
