import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GlobalListEventService {
  constructor() {
  }

  updateList() {
    console.log('GlobalListEventService updateList');
    this._onUpdateList.next(1);
  }

  private readonly _onUpdateList = new Subject<any>();
  onUpdateList: Observable<any> = this._onUpdateList.asObservable();
}
