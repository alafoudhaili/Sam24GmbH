import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "./dashboards/dashboard/dashboard.component";
import {ProfilComponent} from "./profil/profil.component";

const routes: Routes = [
    {
        path: "pages",
        component: DashboardComponent
    },
    { path: 'user', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
    { path: 'element', loadChildren: () => import('./element/element.module').then(m => m.ElementModule) },
    { path: 'largeElement', loadChildren: () => import('./large-element/large-element.module').then(m => m.LargeElementModule) },
    { path: 'kitchen', loadChildren: () => import('./kitchen/kitchen.module').then(m => m.KitchenModule) },
    { path: 'room', loadChildren: () => import('./room/room.module').then(m => m.RoomModule) },
        { path: 'umzug', loadChildren: () => import('./umzug/umzug.module').then(m => m.UmzugModule) },

    { path: 'pages', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)},
    { path: "profil", component: ProfilComponent},
    { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
    { path: 'messageLanding', loadChildren: () => import('./message-landing/message-landing.module').then(m => m.MessageLandingModule) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
