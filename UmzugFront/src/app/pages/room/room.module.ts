import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomRoutingModule } from './room-routing.module';
import { ListRoomsComponent } from './list-rooms/list-rooms.component';
import { AddRoomComponent } from './add-room/add-room.component';
import { ElementRoutingModule } from '../element/element-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    ListRoomsComponent,
    AddRoomComponent
  ],
  imports: [
     CommonModule,
           SharedModule,
           ReactiveFormsModule,
           NgbPagination,
           RoomRoutingModule
  ]
})
export class RoomModule { }
