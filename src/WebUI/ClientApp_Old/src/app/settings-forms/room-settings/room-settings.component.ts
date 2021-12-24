import { Component, OnInit, SimpleChanges } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { of } from "rxjs";
import { WinBoxRef } from "../../dynamicwinbox/win-box-ref";
import { WinBoxConfig } from "../../dynamicwinbox/winbox-config";
import { WinBoxService } from "../../dynamicwinbox/winboxservice";
import { GlobalListEventService } from "../../service/global-list-event.service";
import { ToastService } from "../../service/toast.service";
import { UserInfoPageComponent } from "../../UserInfo/userinfo-page.component";
import {
  CreateUpdateRoomDto,
  FieldType,
  RoomClient,
  RoomExtraInfoTemplate,
} from "../../web-api-client";

@Component({
  selector: "app-room-settings",
  templateUrl: "./room-settings.component.html",
  styleUrls: ["./room-settings.component.css"],
})
export class RoomSettingsComponent implements OnInit {
  constructor(
    private globalListEventService: GlobalListEventService,
    private config: WinBoxConfig,
    private roomClient: RoomClient,
    private toastService: ToastService,
    private winBoxService: WinBoxService,
    private winBoxRef: WinBoxRef
  ) {}

  curRoomName: string = "";

  ngOnInit(): void {
    this.roomId = this.config.data.roomID;
    if (this.roomId > 0) {
      this.action = "update";
      this.roomClient.getOne(this.roomId).subscribe((res) => {
        console.log(JSON.stringify(res.roomExtraInfoFields));

        let tarr = res.roomExtraInfoFields;
        let tdick = {};

        for (let i = 0; i < tarr.length; i++) {
          tdick["userExtra" + tarr[i].key] = tarr[i].value;
        }

        this.model = { ...res, ...tdick };
        this.curRoomName = this.model.name;
        this.winBoxRef.setTitle("Edit Room: " + this.curRoomName);
      });
    } else {
      const startTime = new Date(2021, 0, 1, 7, 0, 0);
      const endTime = new Date(2021, 0, 1, 23, 0, 0);
      this.action = "create";
      this.model = {
        start: startTime,
        end: endTime,
        timeSpanMinutes: 60,
        bookingUserModeId: 0,
        disabled: false,
        defaultBookingTypeId: 2,
        inAdvanceDay: 10,
        autoRelease: 15,
      };
    }

    this.roomClient.getRoomExtraFields().subscribe((res) => {
      console.log(res);

      //this.userForm = this._fb.group({
      //  firstName: [],
      //  roomExtraInfoTemplate: this._fb.array([])
      //});
      let addedFields = this.fields;
      res.forEach((value: RoomExtraInfoTemplate) => {
        if (value.type == FieldType.String) {
          addedFields.push({
            key: `userExtra${value.key}`,
            type: "antInput",
            templateOptions: {
              label: value.key,
              placeholder: value.key,
              required: true,
            },
          });
        } else {
          addedFields.push({
            key: `userExtra${value.key}`,
            type: "antInput",
            templateOptions: {
              type: "number",
              max: 99999,
              min: 1,
              step: 1,
              label: value.key,
              placeholder: value.key,
              errorTip: `Not a valid ${value.key}`,
              required: true,
            },
          });
        }
        this.fields = addedFields;
      });
    });
  }

  action: "update" | "create";
  roomId: number = 0;
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      key: "roomId",
      type: "antInput",
      templateOptions: {
        label: "RoomId",
        placeholder: "RoomId",
        required: true,
      },
      hideExpression: true,
    },
    {
      key: "name",
      type: "antInput",
      templateOptions: {
        label: "Name",
        placeholder: "name",
        required: true,
        extraInfo: "The name for this room",
      },
      asyncValidators: {
        streamNameChangeToWinBox: {
          expression: (control: FormControl) => {
            if (control.value) {
              if (this.action == "create") {
                this.winBoxRef.setTitle("New Room: " + control.value);
              } else {
                if (this.curRoomName !== control.value) {
                  this.winBoxRef.setTitle(
                    "Edit Room: " +
                      this.curRoomName +
                      " | Rename to: " +
                      control.value
                  );
                } else {
                  this.winBoxRef.setTitle("Edit Room: " + this.curRoomName);
                }
              }
            } else {
              this.winBoxRef.setTitle("");
            }
            return of(true);
          },
          message: "This username is already taken.",
        },
      },
    },
    {
      key: "shortName",
      type: "antInput",
      templateOptions: {
        label: "Short Name",
        placeholder: "Short Name",
        required: true,
      },
    },
    {
      key: "chineseName",
      type: "antInput",
      templateOptions: {
        label: "Chinese Name",
        placeholder: "Chinese Name",
        required: true,
      },
    },
    {
      key: "mappingKey",
      type: "antInput",
      templateOptions: {
        label: "Mapping Key",
        placeholder: "Mapping Key",
        required: true,
      },
    },
    {
      key: "start",
      type: "timeprimeng",
      templateOptions: {
        label: "Start",
        placeholder: "Start",
        required: true,
      },
    },
    {
      key: "end",
      type: "timeprimeng",
      templateOptions: {
        label: "End",
        placeholder: "End",
        required: true,
      },
    },
    {
      key: "timeSpanMinutes",
      type: "antInput",
      templateOptions: {
        type: "number",
        max: 99999,
        min: 1,
        step: 1,
        label: "Time Span",
        placeholder: "Time Span",
        errorTip: "Not a valid time span",
        required: true,
      },
    },
    {
      key: "bookingUserModeId",
      type: "antSelect",
      templateOptions: {
        label: "Room open for",
        options: [
          { label: "Anyone", value: 0 },
          { label: "Admin", value: 1 },
        ],
        required: true,
      },
    },
    {
      key: "autoRelease",
      type: "antInput",
      templateOptions: {
        type: "number",
        max: 60,
        min: 0,
        label: "Auto Release (min)",
        placeholder: "Auto Release (min)",
        required: true,
      },
    },
    {
      key: "disabled",
      type: "checkbox",
      templateOptions: {
        label: "disabled",
      },
      hideExpression: true,
    },
    {
      key: "defaultBookingTypeId",
      type: "antSelect",
      templateOptions: {
        label: "Default Booking Type",
        options: [
          { label: "Anyone With Card", value: 2 },
          { label: "User With Card", value: 3 },
          { label: "Free Access ", value: 4 },
        ],
      },
    },
    {
      key: "inAdvanceDay",
      type: "antInput",
      templateOptions: {
        type: "number",
        max: 99999,
        min: 0,
        label: "In Advance Day",
        placeholder: "In Advance Day",
        required: true,
        extraInfo:
          "For far in advance can you book a room, 0 for no restriction",
      },
    },
  ];
  model: any = {};

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  get showCancel(): boolean {
    return true;
  }

  submitLabel: string = "Submit";
  submitButtonDisabled: any;

  showCreateUpdate() {}

  onSubmit() {
    if (this.form.valid) {
      this.submitButtonDisabled = true;
      if (this.action == "create") {
        let createUpdateRoomDto = new CreateUpdateRoomDto();
        createUpdateRoomDto = this.model;
        this.roomClient.createUpdateRoom(createUpdateRoomDto).subscribe(
          (result) => {
            this.globalListEventService.updateList();
            this.toastService.add({
              severity: "success",
              summary: `Create Room OK`,
              detail: `Create Room OK`,
            });
          },
          (error) => {
            console.log(error.response);

            let errors = JSON.parse(error.response);
            this.toastService.add({
              severity: "error",
              summary: `${errors.title}`,
              detail: `${JSON.stringify(errors.errors)}`,
            });
            setTimeout(() => (this.submitButtonDisabled = false), 2000);
          }
        );
      } else if (this.action == "update") {
        let createUpdateRoomDto = new CreateUpdateRoomDto();
        createUpdateRoomDto = this.model;
        this.roomClient.updateRoom(createUpdateRoomDto).subscribe(
          (result) => {
            this.globalListEventService.updateList();
            this.toastService.add({
              severity: "success",
              summary: `Update Room OK`,
              detail: `Update Room OK`,
            });
          },
          (error) => {
            //this.submitButtonDisabled = false;
            console.log(error.response);

            let errors = JSON.parse(error.response);
            this.toastService.add({
              severity: "error",
              summary: `${errors.title}`,
              detail: `${JSON.stringify(errors.errors)}`,
            });
            setTimeout(() => (this.submitButtonDisabled = false), 2000);
          }
        );
      }
    }
  }

  popout() {
    this.winBoxService.open(UserInfoPageComponent, {});
  }

  cancel() {
    this.winBoxRef.close();
    //console.log(this.myWinBoxId);
    //var dialogRef = this.winBoxService.winBoxIdMapper.get(this.myWinBoxId);
    //dialogRef.close(true);
  }

  maxwinbox() {
    this.winBoxRef.maximize();
    //console.log(this.myWinBoxId);
    //var dialogRef = this.winBoxService.winBoxIdMapper.get(this.myWinBoxId);
    //dialogRef.close(true);
  }
}
