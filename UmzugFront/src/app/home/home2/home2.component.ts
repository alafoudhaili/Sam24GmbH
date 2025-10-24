import { ChangeDetectorRef, Component, ElementRef, OnChanges, OnInit, ViewChild} from '@angular/core';
import {SettingsService} from "../../services/settings.service";
import {Settings} from "../../models/Settings";
import {ServicesService} from "../../services/services.service";
import {Services} from "../../models/Services";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.scss']
})
export class Home2Component implements OnInit {
  @ViewChild('backgroundVideo', { static: false }) backgroundVideo!: ElementRef<HTMLVideoElement>;

  listSettings: Settings[]=[];
  listServices: Services[]=[];
  addForm!: FormGroup;
  groupedBrands: any[] = [];
  currentBanner!: string ;
  selectedTab: string = 'objective';


  constructor(
      private settingsService: SettingsService,
      private servicesService:ServicesService,
      private formBuilder: FormBuilder,
      private cdr: ChangeDetectorRef,

  ) {}

  ngOnInit(): void {
    this.getSettings();
    this.getServices();

    this.addForm = this.formBuilder.group({
      nom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
      ptDepart: ['', [Validators.required]],
      ptArrivee: ['', [Validators.required]],
      dateDepart: ['', [Validators.required]],
      width: ['', [Validators.required]],
      height: ['', [Validators.required, Validators.email]],
      weight: ['', [Validators.required]],
      length: ['', [Validators.required]],
      typeTransport: this.formBuilder.array([false, false, false])
    });

    window.addEventListener("scroll", this.handleScroll);
  }

  
  setCurrentBanner(): void {
    if (this.listSettings.length > 0) {
      this.currentBanner = this.listSettings[0].banner;
      if (this.isVideo(this.currentBanner)) {
        this.playVideo();
      }
      this.cdr.detectChanges();
    }
  }

  playVideo(): void {
    if (this.backgroundVideo) {
      this.backgroundVideo.nativeElement.load();  // Recharge la source vidéo
      this.backgroundVideo.nativeElement.play();  // Relance la lecture
    }
  }

  isVideo(bannerUrl: string): boolean {
    const videoExtensions = ['mp4', 'webm', 'ogg'];
    const extension = bannerUrl.split('.').pop()?.toLowerCase();
    return extension ? videoExtensions.includes(extension) : false;
  }


  handleScroll = (): void => {
    const headerTop = document.querySelector(".header-style-four") as HTMLElement;
    const navbarArea = document.querySelector(".navbar-area") as HTMLElement;

    if (headerTop && navbarArea) {
      if (window.scrollY > 50) {
        headerTop.classList.add("hidden");
        navbarArea.classList.add("scrolled");
      } else {
        headerTop.classList.remove("hidden");
        navbarArea.classList.remove("scrolled");
      }
    }
  };


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



    



  formatTime(time: string): Date | null {
    return time ? new Date(`1970-01-01T${time}`) : null;
  }


}
