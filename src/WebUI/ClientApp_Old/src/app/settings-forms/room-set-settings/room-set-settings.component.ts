import {WinBoxConfig} from "../../dynamicwinbox/winbox-config";

import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {
  CreateRoomSetCommand,
  RoomClient,
  RoomNameListDto,
  UpdateRoomSetCommand,
} from "../../web-api-client";
import {map} from "rxjs/operators";
import { WinBoxService } from "src/app/dynamicwinbox/winboxservice";
import {UserInfoPageComponent} from "../../UserInfo/userinfo-page.component";
import {WinBoxRef} from "../../dynamicwinbox/win-box-ref";
import {GlobalListEventService} from "../../service/global-list-event.service";
import {ToastService} from "../../service/toast.service";

@Component({
  selector: 'app-room-set-settings',
  templateUrl: './room-set-settings.component.html',
  styleUrls: ['./room-set-settings.component.css']
})
export class RoomSetSettingsComponent implements OnInit {
  private lastModifyDate: Date;

  constructor(
    private globalListEventService: GlobalListEventService,
    private winBoxRef: WinBoxRef,
    private config: WinBoxConfig, private roomClient: RoomClient, private toastService: ToastService, private winBoxService: WinBoxService) {
  }

  ngOnInit(): void {
    this.roomSetId = this.config.data.roomSetID;
    if (this.roomSetId > 0) {
      this.action = 'update';
      this.roomClient.getOneRoomSet(this.roomSetId).subscribe(
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
  roomSetId: number = 0;
  form = new FormGroup({});
  fields: FormlyFieldConfig[] =
    [
      {
        key: 'name',
        type: 'antInput',
        templateOptions: {
          label: 'Room Set Name',
          placeholder: 'Room Set Name',
          required: true,
        }
      },
      {
        key: 'allRoom',
        type: 'antCheckbox',
        templateOptions: {
          label: 'All room',
          placeholder: 'All room',
          required: true,
        }
      },
      {
        fieldGroup: [
          {
            hideExpression: 'model.allRoom',
            key: 'roomIds',
            type: 'multicheckbox',
            templateOptions: {
              type: 'array',
              label: 'Select rooms',
              placeholder: 'Placeholder',
              description: 'Description',
              required: true,
              multiple: true,
              selectAllOption: 'Select All',
              options: this.roomClient.getFullList().pipe(map((ev: RoomNameListDto[]) =>
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
        let cmd: CreateRoomSetCommand = this.model;
        this.roomClient.createRoomSet(cmd).subscribe(
          result => {
            this.submitButtonDisabled = false;
            this.toastService.add(
              {
                severity: 'success',
                summary: `Room setting updated successfully.`,
                detail: `Room setting updated successfully.`,
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
        let cmd = new UpdateRoomSetCommand();
        cmd = this.model;
        this.roomClient.updateRoomSet(cmd).subscribe(
          result => {
            this.submitButtonDisabled = false;
            this.toastService.add(
              {
                severity: 'success',
                summary: `Room setting updated successfully.`,
                detail: `Room setting updated successfully.`,
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
