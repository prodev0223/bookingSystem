import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import {
  RoomClient,
  RoomExtraInfoTemplate,
  UpdateRoomExtraFieldsCommand,
} from "src/app/common/web-api-client";
import { SnackbarService } from "src/app/service/Snackbar.service";
import { SweetAlertService } from "src/app/service/SweetAlert.service";

@Component({
  selector: "app-RoomExtraFields",
  templateUrl: "./RoomExtraFields.component.html",
  styleUrls: ["./RoomExtraFields.component.sass"],
})
export class RoomExtraFieldsComponent implements OnInit {
  public extraFieldForm: FormGroup;
  roomExtraInfoTemplate?: RoomExtraInfoTemplate[] | undefined;

  constructor(
    private _fb: FormBuilder,
    private roomClient: RoomClient,
    private snackbar: SnackbarService,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.extraFieldForm = this._fb.group({
      roomExtraInfoTemplate: this._fb.array([], isNameDup()),
    });
    this.roomClient.getRoomExtraFields().subscribe((res) => {
      res.forEach((value) => {
        this.addFieldGroupWithData(value.type, value.key);
      });
    });
  }

  private addFieldGroupWithData(type: any, key: any): void {
    this.fieldArray.push(
      this._fb.group({
        type: [type],
        key: [key, Validators.required],
      })
    );
  }

  RemoveField(index: number) {
    this.sweetAlert
      .ConfirmDelete(`Are you sure to remove?`)
      .subscribe((result) => {
        if (result) {
          this.fieldArray.removeAt(index);
        }
      });
  }

  AddMoreFields() {
    this.fieldArray.push(this.addFieldGroup());
  }

  get fieldArray(): FormArray {
    return <FormArray>this.extraFieldForm.get("roomExtraInfoTemplate");
  }

  private addFieldGroup(): FormGroup {
    return this._fb.group({
      type: [1],
      key: ["", Validators.required],
    });
  }

  saveExtraFields() {
    if (this.extraFieldForm.valid) {
      let cmd: UpdateRoomExtraFieldsCommand = this.extraFieldForm.value;
      this.roomClient.updateRoomExtraFields(cmd).subscribe(
        (result) => {
          this.snackbar.showNotification(
            "success",
            "Extra Field added successfully"
          );
        },
        (error) => {
          let errors = JSON.parse(error.response);

          this.snackbar.showNotification(
            "error",
            `${JSON.stringify(errors.errors)}`
          );
        }
      );
    }
  }
}

function isNameDup() {
  const validator: ValidatorFn = (formArray: FormArray) => {
    const totalSelected = formArray.controls.map((control) => control.value);
    const names = totalSelected.map((value) => value.key);
    const hasDuplicate = names.some(
      (name, index) => names.indexOf(name, index + 1) != -1
    );
    return hasDuplicate ? { duplicate: true } : null;
  };
  return validator;
}
