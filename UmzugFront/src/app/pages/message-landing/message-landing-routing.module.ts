import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MessageLandingComponent} from "./message-landing/message-landing.component";

const routes: Routes = [{ path: '', component: MessageLandingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageLandingRoutingModule { }
