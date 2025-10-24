import { AfterViewInit,Component, OnInit } from '@angular/core';
import {SettingsService} from "../../services/settings.service";
import {Settings} from "../../models/Settings";
import {ServicesService} from "../../services/services.service";
import {Services} from "../../models/Services";
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit,AfterViewInit{
  listSettings: Settings[]=[];
  listServices: Services[]=[];
  // set the currenr year

  private meanMenuInitialized = false;

  constructor(
      private settingsService: SettingsService,
      private servicesService:ServicesService,
  

  ) {}
 ngAfterViewInit(): void {
      setTimeout(() => {
      this.initializeMeanMenu();
    }, 100);
  }
 ngOnDestroy(): void {
    // Clean up meanmenu if initialized
    if (this.meanMenuInitialized && $ && $('.mean-menu').length) {
      try {
        $('.mean-menu').meanmenu('destroy');
      } catch (e) {
        console.warn('Error destroying meanmenu:', e);
      }
    }
  }
   private initializeMeanMenu(): void {
    // Check if jQuery and meanmenu plugin are available
    if (typeof $ !== 'undefined' && $ && $.fn && $.fn.meanmenu) {
      try {
        // Initialize meanmenu
        $('.mean-menu').meanmenu({
          meanScreenWidth: "991",
          meanMenuContainer: '.mobile-nav',
          meanMenuOpen: "<span></span> <span></span> <span></span>",
          onePage: false,
        });
        this.meanMenuInitialized = true;
        console.log('MeanMenu initialized successfully');
      } catch (error) {
        console.error('Error initializing MeanMenu:', error);
      }
    } else {
      // Retry after a longer delay
      setTimeout(() => {
        this.initializeMeanMenu();
      }, 500);
    }
  }
  ngOnInit(): void {
    this.getSettings();
    this.getServices();
  }
  getSettings(): void {
    this.settingsService.getSettings().subscribe(
        (settings) => {
          if (settings) {
            this.listSettings = settings;
          }
        },
        (error) => {
          console.error('Erreur lors de la récupération des settings', error);
        }
    );
  }

  getServices(): void {
    this.servicesService.getServices().subscribe(
        (data) => {
          if (data) {
            this.listServices = data;
          }
        },
        (error) => {
          console.error('Erreur lors de la récupération des settings', error);
        }
    );
  }

}
