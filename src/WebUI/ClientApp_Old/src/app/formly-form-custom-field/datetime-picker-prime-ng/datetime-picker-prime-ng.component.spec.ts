import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatetimePickerPrimeNgComponent } from './datetime-picker-prime-ng.component';

describe('DatetimePickerPrimeNgComponent', () => {
  let component: DatetimePickerPrimeNgComponent;
  let fixture: ComponentFixture<DatetimePickerPrimeNgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatetimePickerPrimeNgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatetimePickerPrimeNgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
