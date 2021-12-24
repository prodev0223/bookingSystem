import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { ItsNumber, JDateToStr } from "./CommonFunctions";

export enum ValueType {
  Date,
  Number,
  DateStr,
}

export class FormHelper {
  formGroup: FormGroup;

  constructor(fg: FormGroup) {
    this.formGroup = fg;
  }

  private getControl(controlName: string): FormControl {
    return this.formGroup.get(controlName) as FormControl;
  }

  hasError(controlName: string, errorName: string): boolean {
    let status = false;

    var control = this.formGroup.get(controlName);

    if (control) {
      status = control.errors[errorName];
    }

    return status;
  }

  isNull(controlName: string): boolean {
    var status = true;
    var value = this.formGroup.get(controlName);

    if (value) {
      status = !(value != undefined && value != null);
    }

    return status;
  }

  setValue(controlName: string, value: any, valueType?: ValueType) {
    switch (valueType) {
      case ValueType.Date:
        value = new Date(value);
        break;

      case ValueType.Number:
        value = ItsNumber(value);
        break;
    }

    this.getControl(controlName)?.setValue(value);
  }

  getValue(controlName: string, returnType?: ValueType): any {
    var value = this.getControl(controlName)?.value;

    switch (returnType) {
      case ValueType.Date:
        value = new Date(value);
        break;

      case ValueType.Number:
        value = ItsNumber(value);
        break;

      case ValueType.DateStr:
        value = JDateToStr(value);
        break;
    }

    return value;
  }

  resetForm() {
    this.formGroup.reset();
  }

  resetValue(controlName: string) {
    this.getControl(controlName)?.reset();
  }

  enableDisable(controlName: string, isEnable: boolean) {
    if (isEnable) {
      this.getControl(controlName)?.enable();
    } else {
      this.getControl(controlName)?.disable();
    }
  }

  clearValidators(controlName: string) {
    this.getControl(controlName).clearValidators();
    this.getControl(controlName).updateValueAndValidity();
  }

  addNumericValidator(controlName: string) {
    this.getControl(controlName).setValidators([
      Validators.required,
      Validators.pattern("^[0-9]*$"),
    ]);
    this.getControl(controlName).updateValueAndValidity();
  }

  addDecimalValidator(controlName: string) {
    this.getControl(controlName).setValidators([
      Validators.required,
      Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"),
    ]);
    this.getControl(controlName).updateValueAndValidity();
  }

  setValidators(
    controlName: string,
    validator: ValidatorFn | ValidatorFn[] | null
  ) {
    this.getControl(controlName).setValidators(validator);
    this.getControl(controlName).updateValueAndValidity();
  }

  enableDisableMany(controlNames: string, isEnable: boolean) {
    var controls = controlNames.split(",");

    if (controls && controls.length > 0) {
    }
    if (isEnable) {
      controls.forEach((controlName: string) => {
        this.getControl(controlName)?.enable();
      });
    } else {
      controls.forEach((controlName: string) => {
        this.getControl(controlName)?.disable();
      });
    }
  }

  isRequired(controlname: string): boolean {
    var status: boolean = false;
    const control = this.getControl(controlname);

    if (control) {
      status = control.touched && control.errors?.required;
    }

    return status;
  }

  isInvalid(controlname: string): boolean {
    var status: boolean = false;
    const control = this.getControl(controlname);

    if (control) {
      status = control.touched && control.invalid;
    }

    return status;
  }

  showErrors(showError: boolean) {
    if (showError) {
      Object.keys(this.formGroup.controls).forEach((key) => {
        this.formGroup.controls[key].markAsTouched();
      });
    } else {
      Object.keys(this.formGroup.controls).forEach((key) => {
        this.formGroup.controls[key].markAsUntouched();
      });
    }
  }
}
