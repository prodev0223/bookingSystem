import {Component, OnInit} from '@angular/core';
import {FieldType} from "@ngx-formly/core";

@Component({
  selector: 'app-ant-input',
  templateUrl: './ant-input.component.html',
  styleUrls: ['./ant-input.component.css']
})
export class AntInputComponent extends FieldType {
  showInputError: any;
  get errorState() {
    return this.showError ? 'error' : '';
  }
}
