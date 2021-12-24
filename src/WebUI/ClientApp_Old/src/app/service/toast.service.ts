import { Injectable } from "@angular/core";
import { Message } from "primeng/api/message";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  constructor() {}

  add(message: Message) {
    this._showToast.next(message);
  }

  private readonly _showToast = new Subject<Message>();
  onShowToast: Observable<any> = this._showToast.asObservable();
}
