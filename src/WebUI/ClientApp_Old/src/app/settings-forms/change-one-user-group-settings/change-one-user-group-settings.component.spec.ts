import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOneUserGroupSettingsComponent } from './change-one-user-group-settings.component';

describe('ChangeOneUserGroupSettingsComponent', () => {
  let component: ChangeOneUserGroupSettingsComponent;
  let fixture: ComponentFixture<ChangeOneUserGroupSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeOneUserGroupSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeOneUserGroupSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
