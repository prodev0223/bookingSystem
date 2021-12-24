import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  userInfoCounter: number = 0;
  globalFormDefaultBig: boolean = false;
  searchPageSelected: TheRoom;
  searchPageSize: number;
  searchPageSelectedDate: Date = new Date();

  calViewList: CalendarView[] = [
    {name: 'Daily', code: 'resourceTimeGridDay', smallCalCode: 'date'},
    {name: 'Weekly', code: 'timeGridWeek', smallCalCode: 'week'},
  ];
  selectedCalView: CalendarView = {name: 'Daily', code: 'resourceTimeGridDay', smallCalCode: 'date'};
  calViewIdx: number = 0;
  countSubject: BehaviorSubject<number> = new BehaviorSubject<number>(10);
  countListen = this.countSubject.asObservable();

  addUserInfoCounter(): void {
    this.userInfoCounter++;
    this.countSubject.next(this.userInfoCounter);
  }

  constructor(
    private cookieService: CookieService
  ) {

    this.selectedCalView = this.calViewList[this.calViewIdx];
    if (this.calViewIdx == 1) {
      this.searchPageSize = 1;
    } else {
      this.searchPageSize = 7;
    }
    console.log('constructor settings');
  }

  setCookie(name: string, value: string): void {
    this.cookieService.set(name, value);
  }

  getCookie(name: string): string {
    return this.cookieService.get(name);
  }

  showDebug() {
    return this.getCookie('debug') === 'true';
  }
}
