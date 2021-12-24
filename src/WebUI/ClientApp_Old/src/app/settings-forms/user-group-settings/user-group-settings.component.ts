import {WinBoxConfig} from "../../dynamicwinbox/winbox-config";
import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {
  CreateUserGroupCommand,
  CreateUserRoleCommand,
  RoomClient, RoomNameListDto, SimpleUser, UpdateUserGroupCommand,
  UpdateUserRoleCommand, UserClient,
  UserPermissionClient, UserRole
} from "../../web-api-client";
import {WinBoxService} from "../../dynamicwinbox/winboxservice";
import {UserInfoPageComponent} from "../../UserInfo/userinfo-page.component";
import {WinBoxRef} from "../../dynamicwinbox/win-box-ref";
import {GlobalListEventService} from "../../service/global-list-event.service";
import {map} from "rxjs/operators";
import {ToastService} from "../../service/toast.service";

@Component({
  selector: 'app-user-group-settings',
  templateUrl: './user-group-settings.component.html',
  styleUrls: ['./user-group-settings.component.css']
})
export class UserGroupSettingsComponent implements OnInit {

  constructor(
    private globalListEventService: GlobalListEventService,
    private winBoxRef: WinBoxRef,
    private userClient: UserClient,
    private userPermissionClient: UserPermissionClient,
    private config: WinBoxConfig, private roomClient: RoomClient, private toastService: ToastService, private winBoxService: WinBoxService) {
  }

  ngOnInit(): void {
    this.groupId = this.config.data.groupId;
    if (this.groupId > 0) {
      this.action = 'update';
      this.userClient.getSimpleUserGroupById(this.groupId).subscribe(
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
  groupId: number = 0;
  form = new FormGroup({});
  fields: FormlyFieldConfig[] =
    [{
      type: 'tabs',
      fieldGroup: [
        {
          templateOptions: { label: 'Basic Info' },
          fieldGroup: [
            {
              key: 'id',
              type: 'antInput',
              templateOptions: {
                label: 'user group id',
                required: false,
              },
              hideExpression: true
            },
            {
              key: 'name',
              type: 'antInput',
              templateOptions: {
                label: 'User group name',
                required: true,
              },
            },
          ],
        },
        {
          templateOptions: { label: 'User List' },
          fieldGroup: [
            {
              key: 'userIds',
              type: 'multicheckbox',
              templateOptions: {
                type: 'array',
                label: 'User in this group',
                required: false,
                placeholder: 'User Role Id',
                description: 'User Role Id',
                multiple: true,
                selectAllOption: 'Select All',
                options: this.userClient.getUserAll().pipe(map((ev:SimpleUser[]) =>
                    ev.map(i => {
                        //let res = ;
                        return {label: i.username, value: i.userId};
                      }
                    )
                  )
                )
              },
            },
          ],
        },
        {
          templateOptions: { label: 'User Role List' },
          fieldGroup: [
            {
              fieldGroup: [
                {
                  hideExpression: 'model.allRoom',
                  key: 'userRoleIds',
                  type: 'multicheckbox',
                  templateOptions: {
                    type: 'array',
                    label: 'Select Multiple',
                    placeholder: 'User Role Id',
                    description: 'User Role Id',
                    required: true,
                    multiple: true,
                    selectAllOption: 'Select All',
                    options: this.userClient.getAllUserRole().pipe(map((ev:UserRole[]) =>
                        ev.map(i => {
                            //let res = ;
                            return {label: i.name, value: i.id};
                          }
                        )
                      )
                    )
                  }
                }
              ],
            },
          ],
        },
      ],
    }];

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
        let cmd: CreateUserGroupCommand = this.model;
        this.userClient.createUserGroup(cmd).subscribe(
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
        let cmd: UpdateUserGroupCommand = this.model;
        this.userClient.updateUserGroup(cmd).subscribe(
          result => {
            this.submitButtonDisabled = false;
            this.toastService.add(
              {
                severity: 'success',
                summary: `User role updated successfully`,
                detail: `User role updated successfully`,
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
    let bookingMessage = {'booking': 'booking Successfully done.'};
    this.globalListEventService.updateList();
  }

  popout() {
    this.winBoxService.open(UserInfoPageComponent, {});
  }
}
