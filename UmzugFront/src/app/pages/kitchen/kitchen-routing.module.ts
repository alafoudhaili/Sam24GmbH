import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListKitchensComponent} from "./list-kitchens/list-kitchens.component";
import {AddKitchenComponent} from "./add-kitchen/add-kitchen.component";

const routes: Routes = [{ path: '', component: ListKitchensComponent },
  { path: 'add', component: AddKitchenComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KitchenRoutingModule { }
