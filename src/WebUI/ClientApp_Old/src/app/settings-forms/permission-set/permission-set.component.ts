import {WinBoxConfig} from "../../dynamicwinbox/winbox-config";

import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {
  CreatePermissionSetCommand,
  CreateRoomSetCommand,
  RoomClient,
  RoomNameListDto, UpdatePermissionSetCommand,
  UpdateRoomSetCommand,
  UserPermissionClient
} from "../../web-api-client";
import {WinBoxService} from "../../dynamicwinbox/winboxservice";
import {UserInfoPageComponent} from "../../UserInfo/userinfo-page.component";
import {map} from "rxjs/operators";
import {WinBoxRef} from "../../dynamicwinbox/win-box-ref";
import {GlobalListEventService} from "../../service/global-list-event.service";
import {ToastService} from "../../service/toast.service";

@Component({
  selector: 'app-permission-set',
  templateUrl: './permission-set.component.html',
  styleUrls: ['./permission-set.component.css']
})
export class PermissionSetComponent implements OnInit {

  constructor(
    private globalListEventService: GlobalListEventService,
    private winBoxRef: WinBoxRef,
    private userPermissionClient: UserPermissionClient,
    private config: WinBoxConfig, private roomClient: RoomClient, private toastService: ToastService, private winBoxService: WinBoxService) {
  }

  ngOnInit(): void {
    this.setId = this.config.data.setID;
    if (this.setId > 0) {
      this.action = 'update';
      this.userPermissionClient.getOnePermissionSetQuery(this.setId).subscribe(
        result => {
          this.model = result;
          if (result.lastModified) {
            this.lastModifyDate = result.lastModified;
          } else {
            this.lastModifyDate = result.created;
          }
        },
        error => console.error(error)
      )
    } else {
      this.action = 'create';
    }
  }

  action: 'update' | 'create';
  setId: number = 0;
  form = new FormGroup({});
  fields: FormlyFieldConfig[] =
    [
      {
        key: 'name',
        type: 'antInput',
        templateOptions: {
          label: 'Permission Group Name',
          placeholder: 'Permission Group Name',
          required: true,
        }
      },
      {
        fieldGroup: [
          {
            key: 'permissions',
            type: 'multicheckbox',

            templateOptions: {
              label: 'Select permissions',
              placeholder: 'Placeholder',
              description: 'Description',
              required: true,
              multiple: true,
              selectAllOption: 'Select All',
              type: 'array',
              options: [
                {value: 1, label: 'AllPermission'},
                {value: 2, label: 'BookingViewOnly'},
                {value: 3, label: 'BookingMakeForMyself'},
                {value: 4, label: 'BookingMakeAnyTime'},
                {value: 5, label: 'BookingMakeFixedTime'},
                {value: 6, label: 'BookingMakeAsOtherUserGroup'},
                {value: 7, label: 'BookingModifyCancel'},
                {value: 8, label: 'BookingMakeAsOtherUser'},
                {value: 9, label: 'BookingApprovalPending'},
                {value: 10, label: 'BookingModifyCancelViewRegional'},
                {value: 11, label: 'BookingModifyCancelViewAll'},
                {value: 12, label: 'BookingViewEquipment'},
                {value: 13, label: 'BookingViewAnyBooking'},
                {value: 14, label: 'BookingViewMyBooking'},

                {value: 100, label: 'BookingExtraItem'},
                {value: 110, label: 'FacilityManagement'},
                {value: 130, label: 'AccountManagement'},
                {value: 190, label: 'SmtpSetting'},
                {value: 1000, label: 'ReportsAllUnit'},
                {value: 2000, label: 'ReportsOwnUnit'},
              ],
            }
          }
        ],
      },
    ];

  model: any = {};

  get showCancel(): boolean {
    return true;
  }

  submitLabel: string = "Submit";
  submitButtonDisabled: any;
  lastModifyDate: Date;

  showCreateUpdate() {
  };


  onSubmit() {
    if (this.form.valid) {
      if (this.action == 'create') {
        let cmd: CreatePermissionSetCommand = this.model;
        this.userPermissionClient.createPermissionSet(cmd).subscribe(
          result => {
            this.submitButtonDisabled = false;
            this.toastService.add(
              {
                severity: 'success',
                summary: `Update roomset OK`,
                detail: `Update roomset OK`,
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
        let cmd: UpdatePermissionSetCommand = this.model;
        this.userPermissionClient.updatePermissionSet(cmd).subscribe(
          result => {
            this.submitButtonDisabled = false;
            this.toastService.add(
              {
                severity: 'success',
                summary: `Update roomset OK`,
                detail: `Update roomsset OK`,
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
    this.globalListEventService.updateList();
  }

  popout() {
    this.winBoxService.open(UserInfoPageComponent, {});
  }
}
