import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElementRoutingModule } from './umzug-routing.module';
import { ListUmzugsComponent } from './list-umzugs/list-umzugs.component';
import { AddUmzugComponent } from './add-umzug/add-umzug.component';
import {SharedModule} from "../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [
    ListUmzugsComponent,
    AddUmzugComponent
  ],
    imports: [
        CommonModule,
        ElementRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        NgbPagination
    ]
})
export class UmzugModule { }
