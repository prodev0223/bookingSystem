import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  Calendar,
  CalendarOptions,
  EventClickArg,
  EventInput,
  FullCalendarComponent,
} from "@fullcalendar/angular";
import { DateClickArg } from "@fullcalendar/interaction";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Observable } from "rxjs";
import { AddTimeToDate, ItsNumber } from "src/app/common/CommonFunctions";
import { FormHelper, ValueType } from "src/app/common/FormHelper";
import {
  Booking,
  BookingClient,
  BookingDetailDto,
  BookingStatus,
  BookingType,
  CancelCommand,
  CreateSimpleBookingCommand,
  RoomClient,
  RoomNameListDto,
  SimpleBookingDto,
  UpdateSimpleBookingCommand,
  UserPermission,
} from "src/app/common/web-api-client";
import { PermissionsService } from "src/app/core/service/permissions.service";
import { APIResponse, ErrorResponse } from "src/app/models/APIResponse";
import { SnackbarService } from "src/app/service/Snackbar.service";
import { SweetAlertService } from "src/app/service/SweetAlert.service";

@Component({
  selector: "app-RoomReservation",
  styleUrls: ["./RoomReservation.component.css"],
  templateUrl: "./RoomReservation.component.html",
})
export class RoomReservationComponent implements OnInit {
  fh: FormHelper;
  currentPage = 0;
  allowEdit = true;
  pagedRoomIds = [];
  itemsPerPage = 5;
  showCancel = false;
  roomForm!: FormGroup;
  selectedDate = null;
  selRoomId: number = 1;
  bookingId: number = -1;
  _calendarApi: Calendar;
  searchRoom: string = "";
  roomModalRef?: BsModalRef;
  selDateMode: string = "D";
  calendarView: string = "";
  roomsList: Array<any> = [];
  formCaption = "New Booking";
  filteredRooms: Array<any> = [];
  closedColor: string = "#1B1B1B";
  calendarOptions: CalendarOptions;
  unavailableColor: string = "grey";
  confirmedColor: string = "#1992e5";
  availableColor: string = "#53b652";
  fullCalendarView: string = "resourceTimeGridDay";
  @ViewChild("fullCalendar") calendarComponent: FullCalendarComponent;
  @ViewChild("template", { read: TemplateRef })
  template: TemplateRef<any>;

  constructor(
    private roomClient: RoomClient,
    private snackbar: SnackbarService,
    private modalService: BsModalService,
    private bookingClient: BookingClient,
    private sweetAlert: SweetAlertService,
    private permissionsService: PermissionsService
  ) {
    this.selectedDate = new Date();
  }

  get calendarApi() {
    if (this._calendarApi == undefined) {
      this._calendarApi = this.calendarComponent.getApi();
    }
    return this._calendarApi;
  }

  ngOnInit() {
    this.InitializeOptions();
    this.CreateBookingForm();
    this.fh = new FormHelper(this.roomForm);
  }

  ngAfterViewInit(): void {
    this.LoadBookings();
  }

  onColorSelected() {
    this.GetBookingList();
  }

  CreateBookingForm() {
    this.roomForm = new FormGroup({
      roomId: new FormControl(null),
      bookingId: new FormControl(null),
      anyTimeFrame: new FormControl(null),
      markAsClosed: new FormControl(false),
      description: new FormControl(null, Validators.required),
      end_time: new FormControl(new Date(), Validators.required),
      sel_date: new FormControl(new Date(), Validators.required),
      start_time: new FormControl(new Date(), [Validators.required]),
    });
  }

  onRoomSelected() {
    this.GetBookingList();
  }

  GetRoomIdsForBooking(): Array<number> {
    let roomIds: Array<number> = [];

    switch (this.selDateMode.toUpperCase()) {
      case "M":
        roomIds.push(this.selRoomId);
        break;

      case "W":
        roomIds.push(this.selRoomId);
        break;

      default:
        roomIds = this.pagedRoomIds.map((room) => room.id);
        break;
    }

    return roomIds;
  }

  filterRooms() {
    this.currentPage = 0;
    this.roomsList = this.filteredRooms.filter(
      (room) => room.name.indexOf(this.searchRoom) !== -1
    );
    this.GetPagedbookings();
  }

  InitializeOptions() {
    this.calendarOptions = {
      height: "95%",
      editable: false,
      selectable: true,
      allDaySlot: false,
      eventDisplay: "block",
      scrollTime: "12:00:00",
      slotMinTime: "06:00:00",
      themeSystem: "bootstrap",
      stickyHeaderDates: true,
      displayEventTime: false,
      slotDuration: "00:15:00",
      showNonCurrentDates: false,
      initialDate: this.selectedDate,
      initialView: "resourceTimeGridDay",
      eventClick: this.AddEditBooking.bind(this),
      schedulerLicenseKey: "GPL-My-Project-Is-Open-Source",
      buttonText: {
        today: "Today",
      },
      footerToolbar: {
        center: "preRooms,nextRooms",
      },
      customButtons: {
        preRooms: {
          text: "Previous Rooms",
          click: this.GetPreviousRooms.bind(this),
        },
        nextRooms: {
          text: "Next Rooms",
          click: this.GetNextRooms.bind(this),
        },
      },
      slotLabelFormat: [
        {
          hour: "2-digit",
          minute: "2-digit",
          omitZeroMinute: false,
          meridiem: "short",
          hour12: false,
        },
      ],
      views: {
        dayGrid: {
          // options apply to dayGridMonth, dayGridWeek, and dayGridDay views
        },
        timeGrid: {
          // options apply to timeGridWeek and resourceTimeGridDay views
        },
        week: {
          dayHeaderFormat: { weekday: "long", day: "numeric" },
          // options apply to dayGridWeek and timeGridWeek views
        },
        day: {
          // options apply to dayGridDay and resourceTimeGridDay views
        },
      },
      resources: (fetchInfo, successCallback, failureCallback) => {
        successCallback(this.getCalendarResources());
      },
      dateClick: this.AddEditMonthBooking.bind(this),
      datesSet: (calendarDate) => {
        this.GetBookingList();
        this.selectedDate = this.calendarApi.view.currentStart;
      },
    };
  }

  GetNextRooms() {
    let curPage = this.currentPage + 1;

    if (curPage < this.roomsList.length / this.itemsPerPage) {
      this.currentPage++;
      this.GetPagedbookings();
    } else {
      this.snackbar.showNotification(
        "error",
        "There's no more rooms available"
      );
    }
  }

  GetPreviousRooms() {
    let curPage = this.currentPage - 1;

    if (curPage < 0) {
      this.snackbar.showNotification(
        "error",
        "There's no more rooms available"
      );
    } else {
      this.currentPage--;
      this.GetPagedbookings();
    }
  }

  GetPagedbookings() {
    let startPage = this.currentPage * this.itemsPerPage;
    this.pagedRoomIds = this.roomsList.slice(
      startPage,
      startPage + this.itemsPerPage
    );
    this.RefreshCalendarWithResources();
  }

  onDateChange(result: Date): void {
    this.calendarApi.gotoDate(result);
  }

  GetBookingColor(item: SimpleBookingDto): string {
    let color = this.availableColor;

    if (item.bookingType == BookingType.Closed) {
      color = this.closedColor;
    } else {
      switch (item.status) {
        case BookingStatus.Confirmed:
          color = this.confirmedColor;
          break;

        case BookingStatus.ForBooking:
          if (item.isAvailable) {
            color = this.availableColor;
          } else {
            color = this.unavailableColor;
          }
          break;

        default:
          color = this.availableColor;
          break;
      }
    }

    return color;
  }

  getBookings(url: string) {
    let cmd = {
      roomIds: this.GetRoomIdsForBooking(),
      endDate: this.calendarApi.view.currentEnd.toISOString(),
      startDate: this.calendarApi.view.currentStart.toISOString(),
    };
    this.bookingClient
      .PostCallWithData<SimpleBookingDto>(url, cmd)
      .subscribe((result) => {
        if (result) {
          if (Array.isArray(result)) {
            let calendarEvents: EventInput[] = [];
            result.forEach((item: SimpleBookingDto) => {
              calendarEvents.push({
                end: item.end,
                start: item.start,
                status: item.status,
                title: item.title.trim(),
                myEditable: item.editable,
                bookingId: item.bookingId,
                isAvailable: item.isAvailable,
                roomId: item.roomId.toString(),
                color: this.GetBookingColor(item),
                resourceId: item.resourceId.toString(),
                groupId: item.status == BookingStatus.ForBooking ? "1" : "12",
              });
            });

            this.calendarApi.addEventSource(calendarEvents);
          }
        }
      });
  }

  GetBookingList() {
    this.calendarApi.removeAllEventSources();
    if (this.selDateMode !== "M") {
      this.getBookings("/api/Booking/GetList");
    } else {
      this.getBookings("/api/Booking/GetConfirmedList");
    }
  }

  getAllowedRooms(): Observable<RoomNameListDto[]> {
    return this.roomClient.getMyList();
  }

  BookingCancel() {
    if (this.bookingId > 0) {
      this.CancelBooking(this.bookingId);
    }
  }

  CancelBooking(bookingId: number) {
    if (bookingId > 0) {
      let cmd = new CancelCommand();
      cmd.bookingId = bookingId;

      this.sweetAlert.ConfirmDialogue("Confirm cancel?").subscribe((result) => {
        if (result) {
          this.bookingClient.cancelBooking(cmd).subscribe(
            (result) => {
              this.GetBookingList();
              this.roomModalRef.hide();
              this.snackbar.showNotification(
                "success",
                "Booking cancel successfully"
              );
            },
            (error) => {
              console.log(error.response);
              let errors = JSON.parse(error.response);
              this.snackbar.showNotification(
                "error",
                `${JSON.stringify(errors.errors)}`
              );
            }
          );
        }
      });
    }
  }

  LoadBookings() {
    this.getAllowedRooms().subscribe((result) => {
      if (result !== undefined) {
        if (Array.isArray(result) && result.length > 0) {
          result.forEach((room: RoomNameListDto) => {
            this.roomsList.push({ id: room.id, name: room.name });
            this.filteredRooms.push({ id: room.id, name: room.name });
          });

          if (this.roomsList.length > 0) {
            this.selRoomId = this.roomsList[0].id;
            this.pagedRoomIds = this.roomsList.slice(0, 5);
            this.RefreshCalendarWithResources();
          }
        }
      }
    });
  }

  RefreshCalendarWithResources() {
    this.calendarApi.refetchResources();
    this.GetBookingList();
  }

  getCalendarResources() {
    let resources: Array<any> = [];
    if (Array.isArray(this.pagedRoomIds) && this.pagedRoomIds.length > 0) {
      this.pagedRoomIds.forEach((room) => {
        resources.push({
          title: room.name,
          id: room.id.toString(),
        });
      });
    }
    return resources;
  }

  setCalenderView(mode: string): void {
    mode = mode.toUpperCase();
    this.selDateMode = mode;

    if (mode == "M") {
      this.calendarView = "month";
      this.fullCalendarView = "dayGridMonth";
      this.calendarApi.setOption("footerToolbar", false);
    } else if (mode == "W") {
      this.calendarView = "week";
      this.fullCalendarView = "timeGridWeek";
      this.calendarApi.setOption("footerToolbar", false);
    } else {
      this.calendarView = "";
      this.fullCalendarView = "resourceTimeGridDay";
      this.calendarApi.setOption("footerToolbar", {
        center: "preRooms,nextRooms",
      });
    }

    this.calendarApi.changeView(this.fullCalendarView);
  }

  AddEditBooking(clickInfo: EventClickArg) {
    if (this.IsEventValid(clickInfo)) {
      let bookingId = clickInfo.event.extendedProps.bookingId;

      if (bookingId > 0) {
        this.bookingId = bookingId;
        this.bookingClient.getMyRawBooking(this.bookingId).subscribe(
          (result: any) => {
            let firstInfo: Booking;
            let rawBookingInfo = result;

            if (rawBookingInfo.length > 0) {
              firstInfo = rawBookingInfo[0];
              if (firstInfo.bookingStatus != BookingStatus.Cancelled) {
                this.showCancel = true;
              }
            }

            this.roomForm.patchValue({
              roomId: firstInfo.roomId,
              bookingId: firstInfo.id,
              end_time: new Date(firstInfo.end),
              sel_date: new Date(firstInfo.start),
              start_time: new Date(firstInfo.start),
              description: firstInfo.bookingDetails.description,
              markAsClosed: firstInfo.bookingType == BookingType.Closed,
              anyTimeFrame: this.permissionsService
                .checkRoomPermission(
                  firstInfo.id,
                  UserPermission.BookingMakeAnyTime
                )
                .toString(),
            });

            this.OpenBookingModal(this.template);
          },
          (error) => console.error(error)
        );
      } else {
        this.ResetModalData();
        this.roomForm.patchValue({
          bookingId: bookingId,
          sel_date: this.selectedDate,
          end_time: clickInfo.event.end,
          roomId: this.getRoomId(clickInfo),
          start_time: clickInfo.event.start,
          anyTimeFrame: this.permissionsService
            .checkRoomPermission(
              Number(clickInfo.event.id),
              UserPermission.BookingMakeAnyTime
            )
            .toString(),
        });
        this.OpenBookingModal(this.template);
      }
    } else {
      this.snackbar.showNotification(
        "error",
        `Room : ${this.GetRoomName()} is not available`
      );
    }
  }

  getRoomId(clickInfo: EventClickArg): number {
    let roomId = -1;
    if (this.selDateMode == "D") {
      if (clickInfo.event.extendedProps.roomId) {
        roomId = ItsNumber(clickInfo.event.extendedProps.roomId);
      }
    } else {
      roomId = this.selRoomId;
    }
    return roomId;
  }

  IsEventValid(clickInfo: EventClickArg): boolean {
    return (
      ItsNumber(clickInfo.event.extendedProps.bookingId) > 0 ||
      (clickInfo.event.extendedProps.isAvailable &&
        clickInfo.event.extendedProps.status == BookingStatus.ForBooking)
    );
  }

  AddEditMonthBooking(clickInfo: DateClickArg) {
    if (clickInfo.view.type == "dayGridMonth") {
      this.GetFirstSlot(clickInfo?.date).subscribe(
        (result: RoomNameListDto) => {
          if (result) {
            this.ResetModalData();
            this.roomForm.patchValue({
              roomId: this.selRoomId,
              end_time: new Date(result.end),
              sel_date: new Date(result.start),
              start_time: new Date(result.start),
              anyTimeFrame: this.permissionsService
                .checkRoomPermission(
                  this.selRoomId,
                  UserPermission.BookingMakeAnyTime
                )
                .toString(),
            });
            this.OpenBookingModal(this.template);
          } else {
            this.snackbar.showNotification(
              "error",
              `Room : ${this.GetRoomName()} is not available on ${
                clickInfo.dateStr
              }`
            );
          }
        }
      );
    }
  }

  GetRoomName(roomId: number = this.selRoomId): string {
    let roomName: string = null;
    if (roomId > 0) {
      if (Array.isArray(this.roomsList) && this.roomsList.length > 0) {
        roomName = this.roomsList.find((room) => room.id === roomId).name;
      }
    }
    return roomName;
  }

  GetFirstSlot(selDate: Date): Observable<object> {
    let cmd = {
      roomId: this.selRoomId,
      endDate: selDate.toISOString(),
      startDate: selDate.toISOString(),
    };
    return this.bookingClient.PostCall("/api/Booking/GetFirstSlot", cmd);
  }

  ResetModalData() {
    this.bookingId = 0;
    this.roomForm.reset();
    this.formCaption = "New Booking";
  }

  OpenBookingModal(template: TemplateRef<any>) {
    this.fh.getValue("bookingId", this.bookingId);
    this.roomModalRef = this.modalService.show(template, {
      class: "modal-lg",
    });
  }

  SaveBooking() {
    if (this.roomForm.valid) {
      if (this.bookingId > 0) {
        let bookingDetails = new BookingDetailDto();
        bookingDetails.description = this.fh.getValue("description");
        bookingDetails.equipmentsID = [];

        let selDate = this.fh.getValue("sel_date");
        let cmd = new UpdateSimpleBookingCommand();
        cmd.date = this.fh.getValue("sel_date", ValueType.Date);
        cmd.startTime = AddTimeToDate(
          selDate,
          this.fh.getValue("start_time", ValueType.Date)
        );
        cmd.endTime = AddTimeToDate(
          selDate,
          this.fh.getValue("end_time", ValueType.Date)
        );
        cmd.bookingDetailDto = bookingDetails;
        cmd.roomId = this.fh.getValue("roomId");
        cmd.newRoomId = this.fh.getValue("roomId");
        cmd.bookingId = this.fh.getValue("bookingId");

        if (this.fh.getValue("markAsClosed")) {
          cmd.bookingType = BookingType.Closed;
        }
        this.bookingClient.updateSimpleBooking(cmd).subscribe(
          (resp: APIResponse) => {
            if (resp) {
              if (resp.success) {
                this.GetBookingList();
                this.snackbar.showNotification(
                  "success",
                  "Booking updated successfully"
                );
              } else {
                this.snackbar.showNotification("error", resp.message);
              }
            }
          },
          (error) => {
            let errorResponse: ErrorResponse = JSON.parse(error.response);
            if (errorResponse) {
              this.snackbar.showNotification(
                "error",
                `${JSON.stringify(errorResponse.errors)}`
              );
            }
          }
        );
      } else if (this.bookingId <= 0) {
        let bookingDetails = new BookingDetailDto();
        bookingDetails.description = this.fh.getValue("description");
        bookingDetails.equipmentsID = [];

        let selDate = this.fh.getValue("sel_date");
        let cmd = new CreateSimpleBookingCommand();
        cmd.date = this.fh.getValue("sel_date", ValueType.Date);
        cmd.startTime = AddTimeToDate(
          selDate,
          this.fh.getValue("start_time", ValueType.Date)
        );
        cmd.endTime = AddTimeToDate(
          selDate,
          this.fh.getValue("end_time", ValueType.Date)
        );
        cmd.bookingDetailDto = bookingDetails;
        cmd.roomId = this.fh.getValue("roomId");
        if (this.fh.getValue("markAsClosed")) {
          cmd.bookingType = BookingType.Closed;
        }

        this.bookingClient.create(cmd).subscribe(
          (resp: APIResponse) => {
            if (resp) {
              if (resp.success) {
                this.GetBookingList();
                this.snackbar.showNotification(
                  "success",
                  "Booking created successfully"
                );
              } else {
                this.snackbar.showNotification("error", resp.message);
              }
            }
          },
          (error) => {
            let errorResponse: ErrorResponse = JSON.parse(error.response);
            if (errorResponse) {
              this.snackbar.showNotification(
                "error",
                `${JSON.stringify(errorResponse.errors)}`
              );
            }
          }
        );
      }
      this.roomModalRef.hide();
    }
  }
}
