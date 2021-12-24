import { DatePipe } from "@angular/common";

export function ItsNumber(data: any, decimals?: number): number {
  if (data) {
    if (decimals > 0) {
      return ItsNumber((Number(data) ?? 0).toFixed(decimals));
    } else {
      return Number(data) ?? 0;
    }
  } else {
    return 0;
  }
}

export function AddTodayDate(date: Date): any {
  if (date) {
    let todayDate: Date = new Date();
    date.setDate(todayDate.getDate());
    date.setMonth(todayDate.getMonth());
    date.setFullYear(todayDate.getFullYear());
  }
  return GetUTCDate(date);
}

export function AddTimeToDate(dateToAdd: Date, date: Date): any {
  if (date) {
    date.setDate(dateToAdd.getDate());
    date.setMonth(dateToAdd.getMonth());
    date.setFullYear(dateToAdd.getFullYear());
  }
  return GetUTCDate(date);
}

export function AddDaysToDate(date: Date, days: number): any {
  if (date) {
    let curDate = date;
    return new Date(curDate.setDate(date.getDate() + days));
  }
}

export function GetMonthEndDate(date: Date): Date {
  if (date) {
    return GetUTCDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
  }
}

export function GetMonthStartDate(date: Date): Date {
  if (date) {
    return GetUTCDate(new Date(date.getFullYear(), date.getMonth(), 1));
  }
}

export function GetWeekEndDate(date: Date): Date {
  if (date) {
    var first = date.getDate() - date.getDay();
    var last = first + 6;
    return GetUTCDate(new Date(date.setDate(last)));
  }
}

export function GetWeekStartDate(date: Date): Date {
  if (date) {
    var first = date.getDate() - date.getDay();
    return GetUTCDate(new Date(date.setDate(first)));
  }
}

export function GetUTCDate(date: Date): any {
  if (date) {
    var now_utc = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );
    return new Date(now_utc);
  }
  return date;
}

export function ConvertUTCDate(date: Date): any {
  if (date) {
    return new Date(
      (date.getTime() + date.getTimezoneOffset() * 60 * 1000) / 1000
    );
  }
  return date;
}

export function JDateToStr(date: any): string {
  if (date == null || date == undefined || date === "") {
    return "";
  }

  var datePipe = new DatePipe("en-US");
  return datePipe.transform(date, "dd/MM/yyyy");
}
