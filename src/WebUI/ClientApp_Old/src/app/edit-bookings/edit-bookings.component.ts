import { Component, OnInit, Optional } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { map } from "rxjs/operators";
import { WinBoxRef } from "../dynamicwinbox/win-box-ref";
import { WinBoxConfig } from "../dynamicwinbox/winbox-config";
import { WinBoxService } from "../dynamicwinbox/winboxservice";
import { BookingService } from "../service/booking-service.service";
import { GlobalListEventService } from "../service/global-list-event.service";
import { PermissionsService } from "../service/permissions.service";
import { RoomInfoService } from "../service/room-info.service";
import { SettingsService } from "../service/settings.service";
import { ToastService } from "../service/toast.service";
import { UserInfoPageComponent } from "../UserInfo/userinfo-page.component";
import {
  Booking,
  BookingClient,
  BookingDetailDto,
  BookingStatus,
  BookingType,
  CancelCommand,
  CreateSimpleBookingCommand,
  RoomClient,
  UpdateSimpleBookingCommand,
  UserPermission,
} from "../web-api-client";

@Component({
  selector: "app-edit-bookings",
  templateUrl: "./edit-bookings.component.html",
  styleUrls: ["./edit-bookings.component.css"],
})
export class EditBookingsComponent implements OnInit {
  constructor(
    @Optional() private winBoxRef: WinBoxRef,
    @Optional() private config: WinBoxConfig,
    private roomClient: RoomClient,
    private toastService: ToastService,
    private winBoxService: WinBoxService,
    private permissionsService: PermissionsService,
    private bookingClient: BookingClient,
    private bookingService: BookingService,
    private roomInfoService: RoomInfoService,
    private settingsService: SettingsService,
    private globalListEventService: GlobalListEventService
  ) {}

  info: any;
  roomId: number = 0;

  ngOnInit(): void {
    if (!this.config) {
      return;
    }
    console.log(this.config.data);
    this.info = this.config.data;
    if (this.info.event?.extendedProps?.status == BookingStatus.ForBooking) {
      this.action = "create";
      let anyTimeFrame: string = "true";
      let expectedRoomId: number = 0;
      if (this.info?.event?.extendedProps?.roomId != null) {
        expectedRoomId = parseInt(this.info.event.extendedProps.roomId, 10);
        anyTimeFrame = this.permissionsService
          .checkRoomPermission(
            this.info.event.extendedProps.roomId,
            UserPermission.BookingMakeAnyTime
          )
          .toString();
      }
      this.model = {
        end_time: this.info.event.end,
        start_time: this.info.event.start,
        roomId: expectedRoomId,
        markAsClosed: !!this.info.event?.extendedProps?.markAsClosed,
        anyTimeFrame: anyTimeFrame,
      };
      this.roomId = this.info.event.extendedProps.roomId;
      this.updateTitle(this.roomId);
    } else {
      this.cancelEditingButtonLabel = "Cancel booking";
      let bookingId = this.info.event?.extendedProps?.bookingId.toString();
      if (bookingId === undefined) {
        bookingId = this.info.data.id;
      }
      let rawBookingInfo;
      this.bookingClient.getMyRawBooking(bookingId).subscribe(
        (result) => {
          rawBookingInfo = result;
          if (rawBookingInfo.length > 0) {
            let firstInfo: Booking = rawBookingInfo[0];
            this.lastModifyDate = firstInfo.created;
            if (firstInfo.bookingStatus != BookingStatus.Cancelled) {
              this.showCancel = true;
            }

            console.log(firstInfo);
            this.action = "update";
            this.model = {
              description: firstInfo.bookingDetails.description,
              anyTimeFrame: this.permissionsService
                .checkRoomPermission(
                  firstInfo.id,
                  UserPermission.BookingMakeAnyTime
                )
                .toString(),
              end_time: firstInfo.end,
              start_time: firstInfo.start,
              roomId: firstInfo.roomId,
              bookingId: firstInfo.id,
            };
            if (firstInfo.bookingType == BookingType.Closed) {
              this.model = { ...this.model, markAsClosed: true };
            }
            this.roomId = firstInfo.roomId;

            this.updateTitle(this.roomId);
          }
        },
        (error) => console.error(error)
      );
    }
  }

  updateTitle(roomId: number) {
    const roomInfo = this.bookingService.getRoomInfo(roomId);

    let newTitle = "";
    if (this.action == "create") {
      newTitle = `New booking at:`;
    } else {
      newTitle = `Edit booking at:`;
    }
    this.roomName = roomInfo.name;
    this.userFriendlyMessage = newTitle;
    this.winBoxRef.setTitle(newTitle);
  }

  action: "update" | "create";
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      key: "bookingId",
      type: "antInput",
      templateOptions: {
        label: "Booking ID",
        placeholder: "Booking ID",
        required: false,
        readonly: true,
      },
      hideExpression: () => this.action == "create",
    },
    {
      key: "roomId",
      type: "antInput",
      templateOptions: {
        label: "Room ID",
        placeholder: "Room ID",
        required: true,
        readonly: true,
      },
      hideExpression: true,
    },
    {
      key: "roomId",
      type: "antSelect",
      templateOptions: {
        label: "Room",
        placeholder: "Room",
        min: 1,
        required: true,
        options: this.roomClient.getFullList().pipe(
          map((ev) =>
            ev.map((i) => {
              //let res = ;
              return { label: i.name, value: i.id };
            })
          )
        ),
      },
    },
    {
      className: "col-md-6",
      type: "datetimeprimeng",
      key: "start_time",
      templateOptions: {
        label: "Date",
      },
    },
    {
      className: "col-6 col-md-3 my-2",
      key: "start_time",
      type: "datetimeprimeng",
      templateOptions: {
        label: "Start",
        required: true,
        //readonly: true
      },
    },
    {
      className: "col-6 col-md-3 my-2",
      key: "end_time",
      type: "datetimeprimeng",
      templateOptions: {
        type: "datetime",
        label: "End",
        required: true,
      },
    },
    {
      key: "description",
      type: "antInput",
      templateOptions: {
        errorTip: "Please input description",
        label: "Description",
        placeholder: "Description",
        required: true,
      },
    },
    {
      key: "markAsClosed",
      type: "antCheckbox",
      templateOptions: {
        indeterminate: false,
        label: "Mark as closed",
        placeholder: "Mark as closed",
        required: false,
      },
    },
  ];
  model: any = {};

  showCancel: boolean = false;

  submitLabel: string = "Submit";
  submitButtonDisabled: any;
  userFriendlyMessage: string;
  roomName: string;
  cancelEditingButtonLabel: string = "";
  lastModifyDate: Date;

  get showHidden(): boolean {
    return this.settingsService.showDebug();
  }

  showCreateUpdate() {}

  onSubmit() {
    if (this.form.valid) {
      if (this.action == "create") {
        console.log("create");
        let bookingDetails = new BookingDetailDto();
        bookingDetails.description = this.model.description;
        bookingDetails.equipmentsID = [];

        let createSimpleBookingCommand = new CreateSimpleBookingCommand();
        createSimpleBookingCommand.startTime = this.model.start_time;
        createSimpleBookingCommand.endTime = this.model.end_time;
        createSimpleBookingCommand.bookingDetailDto = bookingDetails;
        createSimpleBookingCommand.roomId = this.model.roomId;
        if (this.model.markAsClosed) {
          createSimpleBookingCommand.bookingType = BookingType.Closed;
        }

        this.bookingClient.create(createSimpleBookingCommand).subscribe(
          (result) => {
            this.toastService.add({
              severity: "success",
              summary: `Booking created successfully.`,
              detail: `Booking created successfully.`,
            });
            this.onBookingEventDone();
          },
          (error) => {
            const errorObject = JSON.parse(error.response);
            this.submitButtonDisabled = false;

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
        let bookingDetails = new BookingDetailDto();
        bookingDetails.description = this.model.description;
        bookingDetails.equipmentsID = [];

        let updateSimpleBookingCommand = new UpdateSimpleBookingCommand();
        updateSimpleBookingCommand.startTime = this.model.start_time;
        updateSimpleBookingCommand.endTime = this.model.end_time;
        updateSimpleBookingCommand.bookingDetailDto = bookingDetails;
        updateSimpleBookingCommand.roomId = this.model.roomId;
        updateSimpleBookingCommand.newRoomId = this.model.roomId;
        updateSimpleBookingCommand.bookingId = this.model.bookingId;

        if (this.model.markAsClosed) {
          updateSimpleBookingCommand.bookingType = BookingType.Closed;
        }
        this.bookingClient
          .updateSimpleBooking(updateSimpleBookingCommand)
          .subscribe(
            (result) => {
              this.toastService.add({
                severity: "success",
                summary: `Booking updated successfully.`,
                detail: `Booking updated successfully.`,
              });
              this.onBookingEventDone();
            },
            (error) => {
              this.submitButtonDisabled = false;
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
    } else {
      console.log(this.form.errors);
    }
  }

  bookingCancel() {
    if (this.action == "update") {
      let cmd = new CancelCommand();
      cmd.bookingId = this.model.bookingId;

      let yesCancel: boolean = confirm("Confirm cancel?");
      if (yesCancel) {
        this.bookingClient.cancelBooking(cmd).subscribe(
          (result) => {
            this.toastService.add({
              severity: "success",
              summary: `Booking cancel successfully.`,
              detail: `Booking cancel successfully.`,
            });
            this.onBookingEventDone();
          },
          (error) => {
            this.submitButtonDisabled = false;
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

  onBookingEventDone(): void {
    let bookingMessage = { booking: "bookingOk" };
    this.bookingService.updateHomeCal();
    this.globalListEventService.updateList();
    this.winBoxRef.close();
  }
}
