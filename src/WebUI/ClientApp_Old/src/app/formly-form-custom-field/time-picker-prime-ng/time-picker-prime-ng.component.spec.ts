import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimePickerPrimeNgComponent } from './time-picker-prime-ng.component';

describe('TimePickerPrimeNgComponent', () => {
  let component: TimePickerPrimeNgComponent;
  let fixture: ComponentFixture<TimePickerPrimeNgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimePickerPrimeNgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimePickerPrimeNgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
