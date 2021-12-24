import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CustomValidators {
  static dateMinimum(date: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) {
        return null;
      } else if (!(control && control.value)) {
        return null;
      } else if (control.errors && !control.errors.invalidMinDate) {
        return null;
      } else if (control.value.getTime() < date.getTime()) {
        control.setErrors({ invalidMinDate: true });
        return { invalidMinDate: true };
      } else {
        return null;
      }
    };
  }
}
