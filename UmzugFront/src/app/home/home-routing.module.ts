import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home.component";
import {AboutComponent} from "./about/about.component";
import {WhyUsChooseComponent} from "./why-us-choose/why-us-choose.component";
import {TeamComponent} from "./team/team.component";
import {GlobalLocationComponent} from "./global-location/global-location.component";
import {FaqComponent} from "./faq/faq.component";
import {ComingSoonComponent} from "./coming-soon/coming-soon.component";
import {TermsConditionsComponent} from "./terms-conditions/terms-conditions.component";
import {PrivacyPolicyComponent} from "./privacy-policy/privacy-policy.component";
import {CompanyHistoryComponent} from "./company-history/company-history.component";
import {CompanyClientsComponent} from "./company-clients/company-clients.component";
import {CareersComponent} from "./careers/careers.component";
import {ServicesComponent} from "./services/services.component";
import {RoadTransportComponent} from "./road-transport/road-transport.component";
import {AirTransportComponent} from "./air-transport/air-transport.component";
import {ServiceDetailsComponent} from "./service-details/service-details.component";
import {NewsGridComponent} from "./news-grid/news-grid.component";
import {NewsFullWidthComponent} from "./news-full-width/news-full-width.component";
import {NewsLeftSidebarComponent} from "./news-left-sidebar/news-left-sidebar.component";
import {NewsRightSidebarComponent} from "./news-right-sidebar/news-right-sidebar.component";
import {NewsDetailsComponent} from "./news-details/news-details.component";
import {RequestQuoteComponent} from "./request-quote/request-quote.component";
import {ContactComponent} from "./contact/contact.component";
import {Home2Component} from "./home2/home2.component";
import {BlogComponent} from "./blog/blog.component";
import { UmzugFormularComponent } from './UmzugFormular/UmzugFormular.component';

const routes: Routes = [{ path: '', component: Home2Component },
    { path: 'home', component: HomeComponent },
    { path: 'blog', component: BlogComponent },
    { path: 'about', component: AboutComponent },
    { path: 'why-us-choose', component: WhyUsChooseComponent },
    { path: 'team', component: TeamComponent },
    { path: 'global-location', component: GlobalLocationComponent },
    { path: 'faq', component: FaqComponent },
    { path: 'coming-soon', component: ComingSoonComponent },
    { path: 'terms-conditions', component: TermsConditionsComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    { path: 'company-history', component: CompanyHistoryComponent },
    { path: 'company-clients', component: CompanyClientsComponent },
    { path: 'careers', component: CareersComponent },
    { path: 'services', component: ServicesComponent },
        { path: 'umzugFormular', component: UmzugFormularComponent },

    { path: 'road-transport', component: RoadTransportComponent },
    { path: 'air-transport', component: AirTransportComponent },
    { path: 'service-details', component: ServiceDetailsComponent },
    { path: 'news-grid', component: NewsGridComponent },
    { path: 'news-full-width', component: NewsFullWidthComponent },
    { path: 'news-left-sidebar', component: NewsLeftSidebarComponent },
    { path: 'news-right-sidebar', component: NewsRightSidebarComponent },
    { path: 'news-details', component: NewsDetailsComponent },
    { path: 'request-quote', component: RequestQuoteComponent },
    { path: 'global-location', component: GlobalLocationComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'faq', component: FaqComponent },



];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
