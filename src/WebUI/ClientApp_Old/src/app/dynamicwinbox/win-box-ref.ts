import {BehaviorSubject, Observable, Subject} from 'rxjs';

export class WinBoxRef {
  constructor() {
  }

  close(result?: any) {
    this._onClose.next(result);
  }

  destroy() {
    this._onDestroy.next();
  }

  maximize() {
    this._onMaximize.next();
  }

  setTitle(title) {
    this._onSetTitle.next(title);
  }

  private readonly _onSetTitle = new Subject<string>();
  onSetTitle: Observable<any> = this._onSetTitle.asObservable();

  private readonly _onMaximize = new Subject<any>();
  onMaximize: Observable<any> = this._onMaximize.asObservable();

  private readonly _onClose = new Subject<any>();
  onClose: Observable<any> = this._onClose.asObservable();

  private readonly _onDestroy = new Subject<any>();
  onDestroy: Observable<any> = this._onDestroy.asObservable();
}
