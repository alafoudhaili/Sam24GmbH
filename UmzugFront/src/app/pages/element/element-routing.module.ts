import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListElementsComponent} from "./list-elements/list-elements.component";
import {AddElementComponent} from "./add-element/add-element.component";

const routes: Routes = [{ path: '', component: ListElementsComponent },
  { path: 'add', component: AddElementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElementRoutingModule { }
