import {Injectable} from '@angular/core';
import {blue, green} from '@ant-design/colors';
import {
  BookingClient,
  BookingStatus,
  BookingType,
  GetAvailableBookingCommand,
  RoomClient,
  RoomExtraInfoField,
  RoomNameListDto
} from "../web-api-client";

import {BehaviorSubject} from 'rxjs';
import {SettingsService} from "./settings.service";

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookableRoomList: number[] = []; // for all views
  private selectRoom: number; // for weekly and monthly view
  private currentPageNo: number = 1;
  //roomFilter: Record<string, string[]> = {};
  private _roomFilter: Record<string, string[]> = {};

  roomNameListDtos: RoomNameListDto[] = Array(7).fill(new RoomNameListDto());
  filteredRoomListDtos: RoomNameListDto[] = Array(7).fill(new RoomNameListDto());

  get roomFilter(): Record<string, string[]> {
    return this._roomFilter;
  }

  set roomFilter(val: Record<string, string[]>) {
    this.currentPageNo = 1;
    this._roomFilter = val;
    if (Object.keys(this._roomFilter).length === 0) {
      //console.log('hererer');
      this.filteredRoomListDtos = this.roomNameListDtos;
      this.gotoPageNo(1);
    } else {
      const firstList = this.roomNameListDtos.filter(i => i.roomExtraInfoFields.length > 0);
      this.filteredRoomListDtos = firstList.filter(i => this.subset2(this.toSimpleDict(i.roomExtraInfoFields), this.roomFilter));
    }
    this.allRoomInfoList.next(this.filteredRoomListDtos);
    this.this7Room();
  }


  listWithPadding: any[];
  pageSize: number;

  constructor(
    private bookingClient: BookingClient,
    private roomClient: RoomClient,
    private settingService: SettingsService
  ) {
    this.pageSize = this.settingService.searchPageSize;
    this.currentPageNo = 1;
    this.setMyBookableRoomIds();
  }

  gotoWeeklyView() {
    this.pageSize = 1;
    this.settingService.searchPageSize = this.pageSize;
    this.dailyRoomList.next(this.getDailyRoomList);
  }

  gotoDailyView() {
    this.pageSize = 7;
    this.settingService.searchPageSize = this.pageSize;
    this.currentPageNo = Math.min(this.currentPageNo, this.totalPageNo);
    this.dailyRoomList.next(this.getDailyRoomList);
  }

  private updateCal = new BehaviorSubject<boolean>(false);
  public bookingEvents = new BehaviorSubject<any[]>([]);

  availableColor: string = green.primary;
  confirmedColor: string = blue.primary;
  ListenToUpdateCall = this.updateCal.asObservable();

  updateHomeCal() {
    this.updateCal.next(true);
  }

  updateBookingEventDateRange(dateStart: Date, dateEnd: Date) {
    let getAvailableBookingCmd = new GetAvailableBookingCommand();
    //    if(this.calendarApi.view.type == "resourceTimeGridDay") {
    //getAvailableBookingCmd.roomIds = this.roomNameListDtos.map(i => i.id) as any[];
    // } else {
      if(!this.getCurr7RoomList || this.getCurr7RoomList.length === 0) {
        return [];
      }
    if (this.getCurr7RoomList[0].id === undefined) {
      return [];
    }
    getAvailableBookingCmd.roomIds = this.getCurr7RoomList.map(i => i.id);
    // }
    var hkStartTime = dateStart;
    var hkEndTime = dateEnd;

    getAvailableBookingCmd.start = hkStartTime;
    getAvailableBookingCmd.end = hkEndTime;
    var res = [];
    this.bookingClient.getList(getAvailableBookingCmd).subscribe(
      result => {
        res = result.map((eventEl) => {
            //console.log(eventEl.start);
            if (eventEl.status == BookingStatus.Confirmed) {
              eventEl.color = this.confirmedColor;
            } else if (eventEl.status == BookingStatus.ForBooking) {
              eventEl.color = this.availableColor;
            }
            var color = eventEl.status == BookingStatus.ForBooking ? this.availableColor : this.confirmedColor;
            if (eventEl.bookingType == BookingType.Closed) {
              color = "#262626"
            }

            return {
              myEditable: eventEl.editable,
              title: eventEl.title,
              start: eventEl.start,
              end: eventEl.end,
              resourceId: eventEl.resourceId.toString(),
              roomId: eventEl.roomId.toString(),
              groupId: eventEl.status == BookingStatus.ForBooking ? '1' : '12',
              color: color,
              status: eventEl.status,
              bookingId: eventEl.bookingId,
            }
          }
        )
        //console.log(res)
        this.bookingEvents.next(
          res
        );
      },
      error => {
        let errors = JSON.parse(error.response);

        if (errors && errors.Title) {
          console.error(errors);
        }

        setTimeout(() => document.getElementById("title").focus(), 250);
      }
    );
  }

  testNumber: number = 1;

  private get haveNextPage(): boolean {
    return this.totalPageNo > this.currentPageNo;
  }

  private get havePrevPage(): boolean {
    return 1 < this.currentPageNo;
  }

  private gotoNextPage() {
    if (this.haveNextPage) {
      this.currentPageNo++;
    }
  }

  private gotoPrevPage() {
    if (this.havePrevPage) {
      this.currentPageNo--;
    }
  }

  private gotoPageNo(pageNo: number) {
    let newPageNo = pageNo;
    newPageNo = Math.max(newPageNo, 1);
    newPageNo = Math.min(newPageNo, this.totalPageNo);
    this.currentPageNo = newPageNo;
  }

  private dailyRoomList = new BehaviorSubject<{ roomInfo: any[], havePrev: boolean, haveNext: boolean, currPage: number, totalPage: number }>(
    {
      roomInfo: [],
      havePrev: false,
      haveNext: false,
      currPage: 1,
      totalPage: 1,
    });
  roomInfo = this.dailyRoomList.asObservable();

  private get getDailyRoomList(): { roomInfo: any[], havePrev: boolean, haveNext: boolean, currPage: number, totalPage: number } {
    return {
      roomInfo: this.getCurr7RoomList,
      havePrev: this.havePrevPage,
      haveNext: this.haveNextPage,
      currPage: this.currentPageNo,
      totalPage: this.totalPageNo,
    };
  }

  toSimpleDict(a: RoomExtraInfoField[]): Record<string, string[]> {
    let res: Record<string, string[]> = {};
    a.forEach(i => res[i.key] = [i.value]);
    return res;
  }

  private subsetString(big: string[], small: string[]): boolean {
    return small.some(val => big.includes(val));
  }

  private subset2(big: Record<string, string[]>, small: Record<string, string[]>): boolean {
    let smallKeyList = Object.keys(small);
    let bigKeyList = Object.keys(big);

    let keyMatch = smallKeyList.every(val => bigKeyList.includes(val));
    if (!keyMatch) {
      return false;
    }
    return smallKeyList.every(i => this.subsetString(big[i], small[i]));
  }

  private get getCurr7RoomList(): RoomNameListDto[] {
    //console.log(this.pageSize);
    let filteredCnt = this.filteredRoomListDtos.length;
    const startNumber: number = (this.currentPageNo - 1) * this.pageSize;
    const endNumber: number = Math.min((this.currentPageNo) * this.pageSize, filteredCnt);
    let list = this.filteredRoomListDtos.slice(startNumber, endNumber);
    return list;
  }

  allRoomInfoList = new BehaviorSubject<RoomNameListDto[]>(Array(0).fill(new RoomNameListDto()));

  get getAllRoomInfoList(): RoomNameListDto[] {
    return this.filteredRoomListDtos;
  }

  getRoomInfo(roomId: number): RoomNameListDto {
    const filtered = this.roomNameListDtos.filter(i => i.id == roomId);
    if (filtered.length > 0) {
      return filtered[0];
    }
  }

  listenAllRoomInfoList = this.allRoomInfoList.asObservable();

  get totalRoomCnt(): number {
    return this.filteredRoomListDtos.length;
  }

  get totalPageNo(): number {
    const total = Math.ceil(this.totalRoomCnt / this.pageSize);
    return total;
  }

  private bookingInfoArray: any[];

  public next7Room(): void {
    this.gotoNextPage();
    this.dailyRoomList.next(this.getDailyRoomList);
  }

  public gotoRoom(roomCode: string): void {
    let pageNo = this.filteredRoomListDtos.findIndex(i => i.id === parseInt(roomCode));
    pageNo = 1 + Math.trunc(pageNo/this.pageSize);
    this.gotoPageNo(pageNo);
    this.dailyRoomList.next(this.getDailyRoomList);
  }

  public this7Room(): void {
    //console.log('this7')
    this.dailyRoomList.next(this.getDailyRoomList);
  }

  public prev7Room(): void {
    this.gotoPrevPage();
    this.dailyRoomList.next(this.getDailyRoomList);
  }

  private setMyBookableRoomIds() {
    this.roomClient.getMyList().subscribe(
      result => {
        const extractRoomExtraInfoField = ([] as RoomExtraInfoField[]).concat(...result.map(r => r.roomExtraInfoFields));
        const buildingListRaw = extractRoomExtraInfoField.filter(i => i.key === 'Building').map(i => i.value);
        this.buildingList = [...new Set(buildingListRaw)].map(i => ({name: i, code: i})).sort((n1, n2) => {
            if (n1.name > n2.name) {
              return 1;
            }
            if (n1.name < n2.name) {
              return -1;
            }
            return 0;
          }
        );

        this.roomNameListDtos = result;
        this.filteredRoomListDtos = result;
        this.allRoomInfoList.next(result);
        this.dailyRoomList.next(this.getDailyRoomList);

      },
      error => {
        let errors = JSON.parse(error.response);
        if (errors && errors.Title) {
        }
      }
    );
  }

  private roomExtraInfo: any[]
  buildingList: { name: string, code: string }[];
}
