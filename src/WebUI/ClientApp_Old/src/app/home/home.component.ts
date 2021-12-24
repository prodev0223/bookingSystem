import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  Calendar,
  CalendarOptions,
  FullCalendarComponent,
} from "@fullcalendar/angular";
import { add } from "date-fns";
import { en_US, NzI18nService } from "ng-zorro-antd/i18n";
import { BehaviorSubject, Observable } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { WinBoxService } from "../dynamicwinbox/winboxservice";
import { EditBookingsComponent } from "../edit-bookings/edit-bookings.component";
import { BookingService } from "../service/booking-service.service";
import { PermissionsService } from "../service/permissions.service";
import { SettingsService } from "../service/settings.service";
import { TitleService } from "../service/title-service.service";
import { ToastService } from "../service/toast.service";
import { BookingStatus, RoomClient, RoomNameListDto } from "../web-api-client";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  listOfSelectedBuildings = [];

  ngOnInit(): void {}

  totalPage: number = 1;
  currentPage: number = 1;

  totalRoomCount: number = 0;
  currentRoom: number = 1;
  haveNext: boolean = false;
  havePrev: boolean = false;

  selectRoomIdx: number = 1;

  @ViewChild("overlayMenuList") overlayMenuList: TemplateRef<any>;
  isFirstLoad: boolean = true;

  @ViewChild("calendar") calendarComponent: FullCalendarComponent;
  @ViewChild("drawer") drawer;
  _calendarApi: Calendar;
  events: any[];
  _self = this;
  roomNameListDtos: RoomNameListDto[];
  calendarStartStr: string;
  calendarEndStr: string;

  calendarStart: Date;
  calendarEnd: Date;

  selectedRoom: TheRoom;
  myRoomList: TheRoom[];
  buildingList: { name: string; code: string }[];
  calViewList: CalendarView[] = this.settingsService.calViewList;
  selectedCalView: CalendarView = this.settingsService.selectedCalView;
  availableColor: string = "#52c41a";
  confirmedColor: string = "#188FFD";
  closedColor: string = "#262626";

  smallCalendarSize: string = "small";
  smallCalMode: "date" | "week" | "month" = this.selectedCalView.smallCalCode;
  smallCalDate: Date = this.settingsService.searchPageSelectedDate;
  navBarMode: "over" | "side" | "push" = "side";
  visible: boolean = true;
  breakpoint: number = 768;
  showaction: boolean = false;

  testMessage() {
    this.toastService.add({
      severity: "success",
      summary: `Create Booking OK`,
      detail: `Create Booking OK`,
    });
  }

  constructor(
    private winBoxService: WinBoxService,
    private settingsService: SettingsService,
    private titleService: TitleService,
    private i18n: NzI18nService,
    private activatedRoute: ActivatedRoute,
    private bookingService: BookingService,
    private permissionsService: PermissionsService,
    private toastService: ToastService,
    private roomClient: RoomClient
  ) {
    this.throttledEventUpdater.subscribe(() => {
      this.bookingService.updateBookingEventDateRange(
        this.calendarStart,
        this.calendarEnd
      );
    });
    if (window.innerWidth > this.breakpoint) {
      this.navBarMode = "side";
    } else {
      this.navBarMode = "over";
    }

    this.i18n.setLocale(en_US);
    window.dispatchEvent(new Event("resize"));
    this.titleService.setTitle("Home");
    //console.log("constructor home");
    this.bookingService.listenAllRoomInfoList.subscribe(
      (result) => {
        console.log(result);
        if (result !== undefined) {
          this.buildingList = this.bookingService.buildingList;
          console.log("result");
          console.log(result);
          this.myRoomList = result.map(
            (r) => ({ name: r.name, code: r.id.toString() } as TheRoom)
          );
          this.selectedRoom = this.myRoomList[0];
          this.updateSelectedRoomLabel(this.selectedRoom);
          this.settingsService.searchPageSelected = this.selectedRoom;
          this.totalRoomCount = this.myRoomList.length;
        }
      },
      (error) => {
        let errors = JSON.parse(error.response);

        if (errors && errors.Title) {
          //console.error(errors);
        }

        setTimeout(() => document.getElementById("title").focus(), 250);
      }
    );

    this.bookingService.ListenToUpdateCall.subscribe((result) => {
      if (result) {
        this.calendarEventUpdateEmitter.next(1);
      }
    });

    this.bookingService.bookingEvents.subscribe((result) => {
      this.calendarOptions.events = result;
    });

    this.bookingService.roomInfo.subscribe(
      (result) => {
        let listWithPadding: any[] = result.roomInfo.map((r) => ({
          id: r.id,
          title: r.name,
        })) as any[];
        let n = this.bookingService.pageSize - listWithPadding.length;
        this.haveNext = result.haveNext;
        this.havePrev = result.havePrev;
        this.currentPage = result.currPage;
        this.totalPage = result.totalPage;

        this.selectedRoom = this.myRoomList[result.currPage - 1];
        this.settingsService.searchPageSelected = this.selectedRoom;

        while (n-- > 0) {
          listWithPadding.push({});
        }
        this.calendarOptions.resources = listWithPadding;
        this.roomDoorDropdown();
      },
      (error) => {
        let errors = JSON.parse(error.response);

        if (errors && errors.Title) {
          //console.error(errors);
        }

        setTimeout(() => document.getElementById("title").focus(), 250);
      }
    );
  }

  prevRoomPage = () => {
    this.bookingService.prev7Room();
    console.log(this.bookingService.buildingList);
  };
  nextRoomPage = () => this.bookingService.next7Room();
  gotoRoomPage = (roomCode: string) => this.bookingService.gotoRoom(roomCode);

  get calendarApi() {
    if (this._calendarApi == undefined) {
      this._calendarApi = this.calendarComponent.getApi();
    }
    return this._calendarApi;
  }

  roomDoorDropdown() {
    if (this.roomNameListDtos !== undefined) {
      this.myRoomList = this.bookingService.getAllRoomInfoList.map(
        (r) =>
          ({
            name: r.name,
            code: r.id.toString(),
          } as TheRoom)
      );
      this.selectedRoom = this.myRoomList[0];
      this.settingsService.searchPageSelected = this.selectedRoom;
    }
  }

  // calendar event update limiter
  private calendarEventUpdateEmitter = new BehaviorSubject<number>(0);
  throttleConfig = {
    leading: true,
    trailing: true,
  };

  get listenDateChange(): Observable<number> {
    return this.calendarEventUpdateEmitter;
  }

  throttledEventUpdater = this.listenDateChange.pipe(debounceTime(400));

  calendarOptions: CalendarOptions = {
    selectable: true,
    slotMinTime: "06:00:00",
    scrollTime: "12:00:00",
    datesSet: (calendarDate) => {
      this.calendarStartStr = calendarDate.startStr;
      this.calendarEndStr = calendarDate.endStr;

      this.calendarStart = calendarDate.start;
      this.calendarEnd = calendarDate.end;

      this.calendarEventUpdateEmitter.next(1);
      this.smallCalDate = calendarDate.start;
      this.settingsService.searchPageSelectedDate = calendarDate.start;
    },
    resourcesSet: (r) => {
      //console.log("resourcesSet");
      if (!this.isFirstLoad) {
        this.bookingService.updateBookingEventDateRange(
          this.calendarStart,
          this.calendarEnd
        );
      }
      this.isFirstLoad = false;
    },
    viewDidMount: (info) => {},
    eventClick: (info) => {
      //console.info('Event: ' + JSON.stringify(info.event));
      //console.info('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
      //console.info('View: ' + info.view.type);
      this.winBoxService.open(EditBookingsComponent, { data: info });
      info.el.style.borderColor = "red";
    },
    initialView: this.selectedCalView.code,
    initialDate: this.settingsService.searchPageSelectedDate,
    stickyHeaderDates: true,
    height: "100%",
    firstDay: 0,
    //rerenderDelay: 100,

    slotDuration: "00:15:00",
    views: {
      dayGrid: {
        // options apply to dayGridMonth, dayGridWeek, and dayGridDay views
      },
      timeGrid: {
        // options apply to timeGridWeek and timeGridDay views
      },
      week: {
        dayHeaderFormat: { weekday: "long", day: "numeric" },
        // options apply to dayGridWeek and timeGridWeek views
      },
      day: {
        // options apply to dayGridDay and timeGridDay views
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

    allDaySlot: false,
    headerToolbar: false,

    dateClick: function (dateInfo) {
      if (this.view.type == "dayGridMonth") {
      }
    },

    events: (info, successCallback, failureCallback) => {
      //console.log("calendar event log");
    },
    resourceOrder: "-type1,type2",
    resources: [],
    schedulerLicenseKey: "GPL-My-Project-Is-Open-Source",
  };
  disabledEndDate = (endValue: Date): boolean => {
    let in14Days = add(new Date(), { weeks: 2 });
    return false;
  };

  getDataFormChildren(event) {
    this.bookingService.updateBookingEventDateRange(
      this.calendarStart,
      this.calendarEnd
    );
  }

  onRoomChange() {
    this.updateSelectedRoomLabel(this.selectedRoom);
    console.log(`onRoomChange: new room number ${this.selectedRoom.code}`);
    this.settingsService.searchPageSelected = this.selectedRoom;
    //console.log(this.selectedRoom.code);
    this.gotoRoomPage(this.selectedRoom.code);
    //this.updateEventColor(BookingStatus.ForBooking, 'red');
  }

  updateSelectedRoomLabel(room: TheRoom) {
    if (room) {
      this.selectedRoomCode = room.code;
      this.selectedRoomName = room.name;
    }
  }

  selectedRoomCode: string = "";
  selectedRoomName: string = "";

  onCalViewChange() {
    this.settingsService.selectedCalView = this.selectedCalView;
    if (this.selectedCalView.code == "resourceTimeGridDay") {
      this.bookingService.gotoDailyView();
    } else if (this.selectedCalView.code == "timeGridWeek") {
      this.bookingService.gotoWeeklyView();
    }
    this.smallCalMode = this.selectedCalView.smallCalCode;

    this.calendarApi.changeView(this.selectedCalView.code);
  }

  gotoToday = () => this.calendarApi.today();
  prevCal = () => this.calendarApi.prev();
  nextCal = () => this.calendarApi.next();
  updateEventCalendar = () => this.calendarEventUpdateEmitter.next(1);
  updateSizeOfCalendar = () => this.calendarApi.updateSize();

  availableColorChange() {
    this.updateEventColor(BookingStatus.ForBooking, "red");
  }

  confirmedColorChange() {
    this.updateEventColor(BookingStatus.Confirmed, "red");
  }

  updateEventColor(bookingStatus: BookingStatus, color: string) {
    const listOfEvents = this.calendarApi.getEventSources()[0];
    listOfEvents.refetch();
  }

  getWeekInfo($event: any) {
    this.calendarApi.gotoDate($event);
    console.log($event);
  }

  listenNavPanel($event: any) {
    this.updateSizeOfCalendar();
  }

  changeNavMode(side: "over" | "side" | "push") {
    this.navBarMode = side;
  }

  onResize(event) {
    const w = event.target.innerWidth;
    if (w >= this.breakpoint) {
      this.visible = true;
      this.drawer.open();
      this.showaction = true;

      this.navBarMode = "side";
    } else {
      // whenever the window is less than 768, hide this component.
      this.navBarMode = "over";
      this.visible = false;
      this.showaction = false;
    }
  }

  isNotSelected(value: string): boolean {
    return this.listOfSelectedBuildings.indexOf(value) === -1;
  }

  towerChange() {
    let newFilter: Record<string, string[]> = {};
    if (this.listOfSelectedBuildings.length > 0) {
      newFilter["Building"] = this.listOfSelectedBuildings;
    }
    //alert(this.listOfSelectedBuildings);
    this.bookingService.roomFilter = newFilter;
    this.updateEventCalendar();

    //alert(JSON.stringify(newFilter));
    //alert(JSON.stringify(this.bookingService.roomFilter));
  }
}
