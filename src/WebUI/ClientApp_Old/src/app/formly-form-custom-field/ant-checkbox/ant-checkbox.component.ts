import {Component, OnInit} from '@angular/core';
import {FieldType} from "@ngx-formly/core";

@Component({
  selector: 'app-ant-checkbox',
  templateUrl: './ant-checkbox.component.html',
  styleUrls: ['./ant-checkbox.component.css']
})
export class AntCheckboxComponent extends FieldType {

  defaultOptions = {
    templateOptions: {
      indeterminate: true,
      hideLabel: true,
    },
  };

}
