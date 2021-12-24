import {
  Component,
  OnInit,
} from '@angular/core';

import {FormArray, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {
  UpdateRoomExtraFieldsCommand,
  RoomClient
} from "../../web-api-client";
import {WinBoxConfig} from "../../dynamicwinbox/winbox-config";
import {WinBoxService} from "../../dynamicwinbox/winboxservice";
import {WinBoxRef} from "../../dynamicwinbox/win-box-ref";
import {SettingsService} from "../../service/settings.service";
import {ToastService} from "../../service/toast.service";


@Component({
  selector: 'app-room-extra-settings',
  templateUrl: './room-extra-settings.component.html',
  styleUrls: ['./room-extra-settings.component.css']
})
export class RoomExtraSettingsComponent implements OnInit {
  name = 'Angular';
  public userForm: FormGroup;
  isUploadingForm: boolean = false;

  get credentials() {
    return this.userForm.get('roomExtraInfoTemplate');
  }

  ngOnInit() {
    if (this.winBoxRef) {
      this.winBoxRef.setTitle('Room Extra Field');
    }
    this.userForm = this._fb.group({
      firstName: [],
      roomExtraInfoTemplate: this._fb.array([], isNameDup())
    });
    this.roomClient.getRoomExtraFields().subscribe(
      res => {
        console.log(res);

        //this.userForm = this._fb.group({
        //  firstName: [],
        //  roomExtraInfoTemplate: this._fb.array([])
        //});
        res.forEach(value => {
          this.addAddressGroupWithData(value.type, value.key);
        });
      }
    );
  }

  constructor(
    private config: WinBoxConfig,
    private winBoxService: WinBoxService,
    private winBoxRef: WinBoxRef,
    private toastService: ToastService,
    private settingsService: SettingsService,
    private roomClient: RoomClient,
    private _fb: FormBuilder
  ) {
  }

  get showDebug(): boolean {
    return this.settingsService.showDebug();
  }

  private addAddressGroup(): FormGroup {
    return this._fb.group({
      type: [1],
      key: ['']
    });
  }

  private addAddressGroupWithData(type, key): void {
    this.addressArray.push(
      this._fb.group({
        type: [type],
        key: [key]
      }));
  }

  addAddress(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }

    this.addressArray.push(this.addAddressGroup());

    console.log(this.addressArray);
  }

  removeAddress(index: number): void {
    this.addressArray.removeAt(index);
  }

  get addressArray(): FormArray {
    return <FormArray>this.userForm.get('roomExtraInfoTemplate');
  }

  addContact(index): void {

    (<FormArray>(<FormGroup>this.addressArray.controls[index]).controls.contacts).push(this.contactsGroup());
  }

  private contactsGroup(): FormGroup {
    return this._fb.group({
      contactPerson: [],
      phoneNumber: ['9712345678', [Validators.maxLength(10)]],
    });
  }

  addPhoneNumber(index: number): void {
    this.addressArray[index].contacts.push(this.contactsGroup());
    console.log(this.addressArray[index].contacts);
  }

  submitForm(): void {
    if (this.userForm.valid) {
      this.isUploadingForm = true;
      let cmd: UpdateRoomExtraFieldsCommand = this.userForm.value;
      this.roomClient.updateRoomExtraFields(cmd).subscribe(
        result => {
          this.toastService.add(
            {
              severity: 'success',
              summary: `Extra Field added successfully.`,
              detail: `Extra Field added successfully.`,
            }
          );
          this.onBookingEventDone();
        },
        error => {
          let errors = JSON.parse(error.response);
          this.toastService.add(
            {
              severity: 'error',
              summary: `${errors.title}`,
              detail: `${JSON.stringify(errors.errors)}`,
            }
          )
        }
      );
    }
  }

  private onBookingEventDone() {
    this.isUploadingForm = false;
  }
}

function isNameDup() {
  const validator: ValidatorFn = (formArray: FormArray) => {
    const totalSelected = formArray.controls
      .map(control => control.value);
    const names = totalSelected.map(value => value.key)
    const hasDuplicate = names.some(
      (name, index) => names.indexOf(name, index + 1) != -1
    );
    return hasDuplicate ? {duplicate: true} : null;
  }
  return validator;
}
