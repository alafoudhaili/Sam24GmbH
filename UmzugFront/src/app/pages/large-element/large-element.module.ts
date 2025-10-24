import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LargeElementRoutingModule } from './large-element-routing.module';
import { ListLargeElementsComponent } from './list-large-elements/list-large-elements.component';
import { AddLargeElementComponent } from './add-large-element/add-large-element.component';
import {SharedModule} from "../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [
    ListLargeElementsComponent,
    AddLargeElementComponent
  ],
    imports: [
        CommonModule,
        LargeElementRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        NgbPagination
    ]
})
export class LargeElementModule { }
