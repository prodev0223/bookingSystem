import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomExtraSettingsComponent } from './room-extra-settings.component';

describe('RoomExtraSettingsComponent', () => {
  let component: RoomExtraSettingsComponent;
  let fixture: ComponentFixture<RoomExtraSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomExtraSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomExtraSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
