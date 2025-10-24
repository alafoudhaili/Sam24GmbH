import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageLandingRoutingModule } from './message-landing-routing.module';
import { MessageLandingComponent } from './message-landing/message-landing.component';
import {NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../shared/shared.module";
import {defineElement} from "lord-icon-element";
import lottie from "lottie-web";


@NgModule({
  declarations: [
    MessageLandingComponent,
  ],
  imports: [
    CommonModule,
    MessageLandingRoutingModule,
    NgbPagination,
    SharedModule,
    NgbTooltip
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MessageLandingModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
