import {WinBoxConfig} from "../../dynamicwinbox/winbox-config";
import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {
  CreateUserGroupCommand,
  CreateUserRoleCommand,
  RoomClient, RoomNameListDto, UpdateSimpleUserGroupCommand, UpdateUserGroupCommand,
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
  selector: 'app-change-one-user-group-settings',
  templateUrl: './change-one-user-group-settings.component.html',
  styleUrls: ['./change-one-user-group-settings.component.css']
})
export class ChangeOneUserGroupSettingsComponent implements OnInit {

  constructor(
    private globalListEventService: GlobalListEventService,
    private winBoxRef: WinBoxRef,
    private userClient: UserClient,
    private userPermissionClient: UserPermissionClient,
    private config: WinBoxConfig, private roomClient: RoomClient, private toastService: ToastService, private winBoxService: WinBoxService) {
  }

  addUserIdToModel(model: any): any {
    let thisUserGroupID = model.map(i => i.id)
    return {groupIds: thisUserGroupID, userId: this.userId};
  }

  ngOnInit(): void {
    this.userId = this.config.data.userId;
    this.groupId = this.config.data.groupId;
    this.userClient.getSimpleUserGroup(this.userId).subscribe(
      result => {
        this.model = this.addUserIdToModel(result);
      },
      error => console.error(error)
    )
  }

  action: 'update' | 'create' = 'update';
  groupId: number = 0;
  userId: string = '';
  form = new FormGroup({});
  fields: FormlyFieldConfig[] =
    [
      {
        key: 'userId',
        type: 'antInput',
        templateOptions: {
          label: 'User Id',
          placeholder: 'User Id',
          required: true,
        }
      },
      {
        key: 'groupIds',
        type: 'multicheckbox',
        templateOptions: {
          type: 'array',
          label: 'Select Multiple UserGroup',
          placeholder: 'Placeholder',
          description: 'Description',
          required: true,
          multiple: true,
          selectAllOption: 'Select All',
          options: this.userClient.getUserGroupList().pipe(map((ev: RoomNameListDto[]) =>
              ev.map(i => {
                  //let res = ;
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
      if (this.action == 'update') {
        let cmd = UpdateSimpleUserGroupCommand.fromJS(this.model);
        this.userClient.updateSimpleUserGroup(cmd).subscribe(
          result => {
            this.submitButtonDisabled = false;
            this.toastService.add(
              {
                severity: 'success',
                summary: `User group updated successfully`,
                detail: `User group updated successfully`,
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
