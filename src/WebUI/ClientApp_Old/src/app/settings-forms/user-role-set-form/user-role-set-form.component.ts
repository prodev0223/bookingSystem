import {WinBoxConfig} from "../../dynamicwinbox/winbox-config";

import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {
  CreateUserRoleCommand,
  RoomClient,
  UpdateUserRoleCommand, UserClient,
  UserPermissionClient
} from "../../web-api-client";
import {WinBoxService} from "../../dynamicwinbox/winboxservice";
import {UserInfoPageComponent} from "../../UserInfo/userinfo-page.component";
import {WinBoxRef} from "../../dynamicwinbox/win-box-ref";
import {GlobalListEventService} from "../../service/global-list-event.service";
import {map} from "rxjs/operators";
import {ToastService} from "../../service/toast.service";

@Component({
  selector: 'app-user-role-set-form',
  templateUrl: './user-role-set-form.component.html',
  styleUrls: ['./user-role-set-form.component.css']
})
export class UserRoleSetFormComponent implements OnInit {

  constructor(
    private globalListEventService: GlobalListEventService,
    private userClient: UserClient,
    private winBoxRef: WinBoxRef,
    private userPermissionClient: UserPermissionClient,
    private config: WinBoxConfig, private roomClient: RoomClient, private toastService: ToastService, private winBoxService: WinBoxService) {
  }

  ngOnInit(): void {
    this.id = this.config.data.ID;
    if (this.id > 0) {
      this.action = 'update';
      this.userClient.getRoleById(this.id).subscribe(
        result => {
          this.model = result;
        },
        error => console.error(error)
      )
    } else {
      this.action = 'create';
    }
  }

  action: 'update' | 'create';
  id: number = 0;
  form = new FormGroup({});
  fields: FormlyFieldConfig[] =
    [
      {
        key: 'name',
        type: 'antInput',
        templateOptions: {
          label: 'User Role',
          placeholder: 'User Role',
          required: true,
        }
      },
      {
        key: 'roomSetId',
        type: 'antSelect',
        templateOptions: {
          label: 'Room Set id',
          placeholder: 'Room Set id',
          min: 1,
          required: true,
          options: this.roomClient.getRoomSetSimple().pipe(map((ev) =>
              ev.map(i => {
                  //let res = ;
                  return {label: i.name, value: i.id};
                }
              )
            )
          )
        }
      },
      {
        key: 'permissionSetId',
        type: 'antSelect',
        templateOptions: {
          label: 'Permission Set id',
          placeholder: 'Permission Set id',
          description: 'Permission Set id',
          required: true,
          multiple: false,
          selectAllOption: 'Select All',
          options: this.userPermissionClient.getPermissionSetNameList().pipe(map((ev) =>
              ev.map(i => {
                  return {label: i.name, value: i.id};
                }
              )
            )
          )
        }
      }
    ];

  model: any = {};

  get showCancel(): boolean {
    return true;
  }

  submitLabel: string = "Submit";
  submitButtonDisabled: any;

  showCreateUpdate() {
  };


  onSubmit() {
    if (this.form.valid) {
      if (this.action == 'create') {
        let cmd: CreateUserRoleCommand = this.model;
        this.userClient.createUserRole(cmd).subscribe(
          result => {
            this.submitButtonDisabled = false;
            this.toastService.add(
              {
                severity: 'success',
                summary: `User role created successfully.`,
                detail: `User role created successfully.`,
              }
            );
            this.onBookingEventDone();
          },
          error => {
            this.submitButtonDisabled = false;
            let errors = JSON.parse(error.response);
            this.toastService.add(
              {
                severity: 'error',
                summary: `${errors.title}`,
                detail: `${JSON.stringify(errors.errors)}`,
              }
            )
            setTimeout(() => this.submitButtonDisabled = false, 2000);
          }
        );
      } else if (this.action == 'update') {
        let cmd: UpdateUserRoleCommand = this.model;
        this.userClient.updateUserRole(cmd).subscribe(
          result => {
            this.submitButtonDisabled = false;
            this.toastService.add(
              {
                severity: 'success',
                summary: `User role updated successfully.`,
                detail: `User role updated successfully.`,
              }
            );
            this.onBookingEventDone();
          },
          error => {
            this.submitButtonDisabled = false;
            let errors = JSON.parse(error.response);
            this.toastService.add(
              {
                severity: 'error',
                summary: `${errors.title}`,
                detail: `${JSON.stringify(errors.errors)}`,
              }
            )
            setTimeout(() => this.submitButtonDisabled = false, 2000);
          }
        );
      }

    }
  }

  bookingCancel() {
    this.winBoxRef.close();
  }

  onBookingEventDone(): void {
    //  this.display = false;
    let bookingMessage = {'booking': 'bookingOk'};
    this.globalListEventService.updateList();
  }

  popout() {
    this.winBoxService.open(UserInfoPageComponent, {});
  }
}
