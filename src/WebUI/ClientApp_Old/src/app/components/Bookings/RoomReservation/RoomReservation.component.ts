import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { blue, green, grey } from "@ant-design/colors";
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
import { GetUTCDate, ItsNumber } from "src/app/common/CommonFunctions";
import { ToastService } from "src/app/service/toast.service";
import {
  BookingClient,
  BookingStatus,
  BookingType,
  GetAvailableBookingCommand,
  GetFirstAvailableBookingCommand,
  RoomClient,
  RoomNameListDto,
  SimpleBookingDto,
} from "src/app/web-api-client";
import { RoomBookingComponent } from "../RoomBooking/RoomBooking.component";

@Component({
  selector: "app-RoomReservation",
  templateUrl: "./RoomReservation.component.html",
  styleUrls: ["./RoomReservation.component.css"],
})
export class RoomReservationComponent implements OnInit, AfterViewInit {
  currentPage = 0;
  pagedRoomIds = [];
  itemsPerPage = 5;
  selectedDate = null;
  selRoomId: number = 1;
  selectedRoom: TheRoom;
  _calendarApi: Calendar;
  bsModalRef?: BsModalRef;
  selDateMode: string = "D";
  calendarView: string = "";
  roomsList: Array<any> = [];
  calendarOptions: CalendarOptions;
  calendarEvents: EventInput[] = [];
  closedColor: string = "#1B1B1B";
  confirmedColor: string = blue.primary;
  availableColor: string = green.primary;
  unavailableColor: string = grey.primary;
  fullCalendarView: string = "resourceTimeGridDay";
  @ViewChild("fullCalendar") calendarComponent: FullCalendarComponent;

  constructor(
    private roomClient: RoomClient,
    private toastService: ToastService,
    private modalService: BsModalService,
    private bookingClient: BookingClient
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
  }

  ngAfterViewInit(): void {
    this.LoadBookings();
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

  availableColorChange() {
    this.updateEventColor(BookingStatus.ForBooking, "red");
  }

  confirmedColorChange() {
    this.updateEventColor(BookingStatus.Confirmed, "red");
  }

  unavailableColorChange() {
    this.updateEventColor(BookingStatus.Confirmed, "red");
  }

  updateEventColor(bookingStatus: BookingStatus, color: string) {
    const listOfEvents = this.calendarApi.getEventSources()[0];
    listOfEvents.refetch();
  }

  InitializeOptions() {
    this.calendarOptions = {
      height: "95%",
      editable: false,
      selectable: true,
      allDaySlot: false,
      scrollTime: "12:00:00",
      stickyHeaderDates: true,
      slotMinTime: "06:00:00",
      slotDuration: "00:15:00",
      showNonCurrentDates: false,
      events: this.calendarEvents,
      initialDate: this.selectedDate,
      initialView: "resourceTimeGridDay",
      eventClick: this.AddEditBooking.bind(this),
      schedulerLicenseKey: "GPL-My-Project-Is-Open-Source",
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
      this.toastService.add({
        severity: "error",
        summary: `Room is not available`,
        detail: `There's no more rooms available`,
      });
    }
  }

  GetPreviousRooms() {
    let curPage = this.currentPage - 1;

    if (curPage < 0) {
      this.toastService.add({
        severity: "error",
        summary: `Room is not available`,
        detail: `There's no more rooms available`,
      });
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
      color = "#262626";
    } else {
      switch (item.status) {
        case BookingStatus.Confirmed:
          color = this.confirmedColor;
          break;

        case BookingStatus.ForBooking:
          if (item.isAvailable) {
            color = this.availableColor;
          } else {
            color = item.color;
          }
          break;

        default:
          color = this.availableColor;
          break;
      }
    }

    return color;
  }

  GetBookingList() {
    if (this.selDateMode === "M") {
      this.calendarEvents = [];
      this.calendarApi.removeAllEventSources();
      return;
    }

    let cmd = new GetAvailableBookingCommand();
    cmd.roomIds = [];
    cmd.roomIds = this.GetRoomIdsForBooking();
    cmd.end = this.calendarApi.view.currentEnd;
    cmd.start = this.calendarApi.view.currentStart;

    this.calendarEvents = [];
    this.calendarApi.removeAllEventSources();

    this.bookingClient.getList(cmd).subscribe(
      (result) => {
        result.forEach((item: SimpleBookingDto) => {
          this.calendarEvents.push({
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

        this.calendarApi.addEventSource(this.calendarEvents);
      },
      (error) => console.error(error)
    );
  }

  getAllowedRooms(): Observable<RoomNameListDto[]> {
    return this.roomClient.getMyList();
  }

  LoadBookings() {
    this.getAllowedRooms().subscribe((result) => {
      if (result !== undefined) {
        if (Array.isArray(result) && result.length > 0) {
          result.forEach((room: RoomNameListDto) => {
            this.roomsList.push({ id: room.id, name: room.name });
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

  OpenBookingModal(modalData: any) {
    this.bsModalRef = this.modalService.show(RoomBookingComponent, {
      class: "modal-lg",
      initialState: {
        modalData: modalData,
      },
    });

    this.bsModalRef.content.onClose.subscribe((isUpdated: boolean) => {
      this.bsModalRef.hide();
      if (isUpdated === true) {
        this.GetBookingList();
      }
    });
  }

  AddEditBooking(clickInfo: EventClickArg) {
    if (
      ItsNumber(clickInfo.event.extendedProps.bookingId) > 0 ||
      clickInfo.event.extendedProps.isAvailable
    ) {
      let modalData = {
        allowEdit: false,
        id: clickInfo.event.id,
        roomId: this.selRoomId,
        roomsList: this.roomsList,
        end: clickInfo.event.end,
        selDate: this.selectedDate,
        start: clickInfo.event.start,
        title: clickInfo.event.title,
        viewType: clickInfo.view.type,
        bookingId: clickInfo.event.extendedProps.bookingId,
        bookingStatus: clickInfo.event.extendedProps.status,
        markAsClosed: clickInfo.event.extendedProps.markAsClosed,
      };

      this.OpenBookingModal(modalData);
    } else {
      this.toastService.add({
        severity: "error",
        summary: `Room is not available`,
        detail: `Room : ${this.GetRoomName()} is not available`,
      });
    }
  }

  AddEditMonthBooking(clickInfo: DateClickArg) {
    if (clickInfo.view.type == "dayGridMonth") {
      this.GetAvailableSlots(clickInfo?.date).subscribe((result) => {
        if (result) {
          let modalData = {
            allowEdit: false,
            end: result.end,
            start: result.start,
            selDate: result.start,
            roomId: this.selRoomId,
            roomsList: this.roomsList,
            viewType: clickInfo.view.type,
            bookingStatus: BookingStatus.ForBooking,
          };
          this.OpenBookingModal(modalData);
          this.bsModalRef.content.roomId = Number(this.selRoomId);
        } else {
          this.toastService.add({
            severity: "error",
            summary: `Room is not available`,
            detail: `Room : ${this.GetRoomName()} is not available on ${
              clickInfo.dateStr
            }`,
          });
        }
      });
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

  GetAvailableSlots(selDate: Date): Observable<SimpleBookingDto> {
    let cmd = new GetFirstAvailableBookingCommand();
    cmd.roomId = this.selRoomId;
    cmd.end = GetUTCDate(selDate);
    cmd.start = GetUTCDate(selDate);
    return this.bookingClient.getFirstSlot(cmd);
  }
}
