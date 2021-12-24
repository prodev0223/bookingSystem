import {Component, OnInit} from '@angular/core';
import {FieldType} from "@ngx-formly/core";

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import {FormlySelectModule} from '@ngx-formly/core/select';

@Component({
  selector: 'app-ant-multi-checkbox',
  templateUrl: './ant-multi-checkbox.component.html',
  styleUrls: ['./ant-multi-checkbox.component.css']
})
export class AntMultiCheckboxComponent extends FieldType {


  defaultOptions = {
    templateOptions: {
      options: [],
      formCheck: 'default', // 'default' | 'inline' | 'switch' | 'inline-switch'
    },
  };

  onChange(value: any, checked: boolean) {
    if (this.to.type === 'array') {
      this.formControl.patchValue(
        checked
          ? [...(this.formControl.value || []), value]
          : [...(this.formControl.value || [])].filter((o) => o !== value),
      );
    } else {
      this.formControl.patchValue({...this.formControl.value, [value]: checked});
    }
    this.formControl.markAsTouched();
  }

  isChecked(option: any) {
    const value = this.formControl.value;

    return value && (this.to.type === 'array' ? value.indexOf(option.value) !== -1 : value[option.value]);
  }
  antChange(an)
  {
    this.formControl.patchValue(an);
    console.log(an);
    this.formControl.markAsTouched();
  }

}
