import {Component, OnInit} from '@angular/core';
import {FieldType} from "@ngx-formly/core";

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})

export class DatePickerComponent extends FieldType {
  constructor() {
    super();
    //this.formControl.setValue(new Date());
  }
}
