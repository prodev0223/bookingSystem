import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSetSettingsComponent } from './room-set-settings.component';

describe('RoomSetSettingsComponent', () => {
  let component: RoomSetSettingsComponent;
  let fixture: ComponentFixture<RoomSetSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomSetSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
