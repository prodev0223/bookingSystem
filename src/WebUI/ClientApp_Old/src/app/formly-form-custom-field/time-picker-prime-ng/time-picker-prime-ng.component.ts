import {Component, OnInit} from '@angular/core';
import {FieldType} from "@ngx-formly/core";

@Component({
  selector: 'app-time-picker-prime-ng',
  templateUrl: './time-picker-prime-ng.component.html',
  styleUrls: ['./time-picker-prime-ng.component.css']
})

export class TimePickerPrimeNgComponent extends FieldType implements OnInit {

  constructor() {
    super();

  }

  ngOnInit(): void {
  }

}
