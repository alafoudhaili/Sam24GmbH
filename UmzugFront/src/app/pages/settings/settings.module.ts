import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { AboutUsComponent } from './about-us/about-us.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {UiSwitchModule} from "ngx-ui-switch";
import lottie from "lottie-web";
import {defineElement} from "lord-icon-element";
import {NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import { ServicesComponent } from './services/services.component';


@NgModule({
  declarations: [
    SettingsComponent,
    AboutUsComponent,
    ServicesComponent
  ],
    imports: [
        CommonModule,
        SettingsRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        UiSwitchModule,
        CKEditorModule,
        NgbTooltip,
        NgbPagination,

    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SettingsModule {
    constructor() {
        defineElement(lottie.loadAnimation);
    }
}
