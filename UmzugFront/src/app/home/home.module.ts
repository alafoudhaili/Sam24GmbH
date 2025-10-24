import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { NewsGridComponent } from './news-grid/news-grid.component';
import { CareersComponent } from './careers/careers.component';
import { ContactsComponent } from './contacts/contacts.component';
import { AboutComponent } from './about/about.component';
import { WhyUsChooseComponent } from './why-us-choose/why-us-choose.component';
import { TeamComponent } from './team/team.component';
import { GlobalLocationComponent } from './global-location/global-location.component';
import { FaqComponent } from './faq/faq.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CompanyHistoryComponent } from './company-history/company-history.component';
import { CompanyClientsComponent } from './company-clients/company-clients.component';
import { ServicesComponent } from './services/services.component';
import { RoadTransportComponent } from './road-transport/road-transport.component';
import { AirTransportComponent } from './air-transport/air-transport.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { NewsFullWidthComponent } from './news-full-width/news-full-width.component';
import { NewsLeftSidebarComponent } from './news-left-sidebar/news-left-sidebar.component';
import { NewsRightSidebarComponent } from './news-right-sidebar/news-right-sidebar.component';
import { NewsDetailsComponent } from './news-details/news-details.component';
import { RequestQuoteComponent } from './request-quote/request-quote.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home.component';
import {NgbCarousel, NgbSlide} from "@ng-bootstrap/ng-bootstrap";
import {ColorPickerModule} from "ngx-color-picker";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { Home2Component } from './home2/home2.component';
import { BlogComponent } from './blog/blog.component';
import { LayoutsModule } from '../layouts/layouts.module'; 
import { UmzugFormularComponent } from './UmzugFormular/UmzugFormular.component';


@NgModule({
  declarations: [
    NewsGridComponent,
    CareersComponent,
    ContactsComponent,
    AboutComponent,
    WhyUsChooseComponent,
    TeamComponent,
    GlobalLocationComponent,
    FaqComponent,
    ComingSoonComponent,
    TermsConditionsComponent,
    PrivacyPolicyComponent,
    CompanyHistoryComponent,
    CompanyClientsComponent,
    ServicesComponent,
    RoadTransportComponent,
    AirTransportComponent,
    ServiceDetailsComponent,
    NewsFullWidthComponent,
    NewsLeftSidebarComponent,
    NewsRightSidebarComponent,
    NewsDetailsComponent,
    RequestQuoteComponent,
    ContactComponent,
    HomeComponent,
    Home2Component,
    BlogComponent,
    UmzugFormularComponent,
  ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        FormsModule,
        NgbCarousel,
        NgbSlide,
        ColorPickerModule,
        ReactiveFormsModule,
        LayoutsModule

    ]
})
export class HomeModule { }
