import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListUmzugsComponent} from "./list-umzugs/list-umzugs.component";
import {AddUmzugComponent} from "./add-umzug/add-umzug.component";

const routes: Routes = [{ path: '', component: ListUmzugsComponent },
  { path: 'add', component: AddUmzugComponent },
    { path: 'add/:id', component: AddUmzugComponent }  // /pages/umzug/add/123

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElementRoutingModule { }
