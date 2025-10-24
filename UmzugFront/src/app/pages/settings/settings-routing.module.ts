import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SettingsComponent} from "./settings/settings.component";
import {AboutUsComponent} from "./about-us/about-us.component";
import {ServicesComponent} from "./services/services.component";

const routes: Routes = [{ path: '', component: SettingsComponent },
    { path: 'about-us', component: AboutUsComponent },
    { path: 'services', component: ServicesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
