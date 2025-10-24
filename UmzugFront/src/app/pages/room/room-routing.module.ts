import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListRoomsComponent} from "./list-rooms/list-rooms.component";
import {AddRoomComponent} from "./add-room/add-room.component";

const routes: Routes = [{ path: '', component: ListRoomsComponent },
  { path: 'add', component: AddRoomComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomRoutingModule { }
