import {Injectable} from '@angular/core';
import {CreateUpdateRoomDto, Room, RoomClient, UpdateRoomCommand} from "../web-api-client";
import {take} from "rxjs/operators";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoomInfoService {
  defaultInfo: CreateUpdateRoomDto;
  roomInfo: BehaviorSubject<CreateUpdateRoomDto>;

  constructor(private roomClient: RoomClient) {
    this.defaultInfo = new CreateUpdateRoomDto();
    this.roomInfo = new BehaviorSubject<CreateUpdateRoomDto>(this.defaultInfo);
  }

  getRoomInfo(roomId: number): Observable<CreateUpdateRoomDto> {
    return this.roomInfo.asObservable();
  }

  pGetRoomInfo(roomId: number): void {
    this.roomClient.getOne(roomId).subscribe(res => {
      this.roomInfo.next(res);
    });
  }

  updateRoomInfo(updateRoomCommand: UpdateRoomCommand): void {
    this.roomClient.updateRoom(updateRoomCommand).subscribe(res => {
    });
  }
}
