import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { KitchenRoutingModule } from './kitchen-routing.module';
import { ListKitchensComponent } from './list-kitchens/list-kitchens.component';
import { AddKitchenComponent } from './add-kitchen/add-kitchen.component';
import {SharedModule} from "../../shared/shared.module";
import {UiSwitchModule} from "ngx-ui-switch";
import {NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {defineElement} from "lord-icon-element";
import lottie from "lottie-web";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ListKitchensComponent,
    AddKitchenComponent
  ],
  imports: [
    CommonModule,
    KitchenRoutingModule,
    SharedModule,
    UiSwitchModule,
    NgbPagination,
    ReactiveFormsModule,
    NgbTooltip
],
schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KitchenModule {
  constructor() {
    defineElement(lottie.loadAnimation);
}
 }
