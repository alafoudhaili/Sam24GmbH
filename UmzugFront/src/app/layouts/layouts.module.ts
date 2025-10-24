import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {NgbDropdownModule, NgbNavModule, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
import { LanguageService } from '../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';

// Component pages
import { LayoutComponent } from './layout.component';
import { VerticalComponent } from './vertical/vertical.component';
import { TopbarComponent } from './topbar/topbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { FooterfrontComponent } from './footerFront/footerFront.component';

import { RightsidebarComponent } from './rightsidebar/rightsidebar.component';
import { HorizontalComponent } from './horizontal/horizontal.component';
import { HorizontalTopbarComponent } from './horizontal-topbar/horizontal-topbar.component';
import { TwoColumnComponent } from './two-column/two-column.component';
import { TwoColumnSidebarComponent } from './two-column-sidebar/two-column-sidebar.component';
import { HeaderComponent } from './header/header.component';


@NgModule({
    declarations: [
        LayoutComponent,
        VerticalComponent,
        TopbarComponent,
        SidebarComponent,
        FooterComponent,
        FooterfrontComponent,

        RightsidebarComponent,
        HorizontalComponent,
        HorizontalTopbarComponent,
        TwoColumnComponent,
        TwoColumnSidebarComponent,
        HeaderComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgbDropdownModule,
        NgbNavModule,
        SimplebarAngularModule,
        TranslateModule,
        NgbPagination,
    ],
    exports: [
        FooterfrontComponent,

        FooterComponent,
                HeaderComponent,
    ],
    providers: [LanguageService]
})
export class LayoutsModule { }
