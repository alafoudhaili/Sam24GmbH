import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ListUsersComponent } from './list-users/list-users.component';
import { AddUserComponent } from './add-user/add-user.component';
import {SharedModule} from "../../shared/shared.module";
import {UiSwitchModule} from "ngx-ui-switch";
import {NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {defineElement} from "lord-icon-element";
import lottie from "lottie-web";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ListUsersComponent,
    AddUserComponent
  ],
    imports: [
        CommonModule,
        UsersRoutingModule,
        SharedModule,
        UiSwitchModule,
        NgbPagination,
        ReactiveFormsModule,
        NgbTooltip
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsersModule {
    constructor() {
        defineElement(lottie.loadAnimation);
    }
}
