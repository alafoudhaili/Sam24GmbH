import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElementRoutingModule } from './element-routing.module';
import { ListElementsComponent } from './list-elements/list-elements.component';
import { AddElementComponent } from './add-element/add-element.component';
import {SharedModule} from "../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [
    ListElementsComponent,
    AddElementComponent
  ],
    imports: [
        CommonModule,
        ElementRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        NgbPagination
    ]
})
export class ElementModule { }
