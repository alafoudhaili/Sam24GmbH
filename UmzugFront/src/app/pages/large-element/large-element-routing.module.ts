import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListLargeElementsComponent} from "./list-large-elements/list-large-elements.component";
import {AddLargeElementComponent} from "./add-large-element/add-large-element.component";

const routes: Routes = [{ path: '', component: ListLargeElementsComponent },
  { path: 'add', component: AddLargeElementComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LargeElementRoutingModule { }
