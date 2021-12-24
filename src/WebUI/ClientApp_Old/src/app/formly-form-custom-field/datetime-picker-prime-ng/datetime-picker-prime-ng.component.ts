import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'app-datetime-picker-prime-ng',
  templateUrl: './datetime-picker-prime-ng.component.html',
  styleUrls: ['./datetime-picker-prime-ng.component.css']
})
export class DatetimePickerPrimeNgComponent extends FieldType {
  constructor() {
    super();
    //this.formControl.setValue(new Date());
  }

}
