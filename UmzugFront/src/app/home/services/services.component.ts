import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Settings} from "../../models/Settings";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SettingsService} from "../../services/settings.service";
import {SweetAlertService} from "../../services/sweet-alert.service";
import {Router} from "@angular/router";
import {ServicesService} from "../../services/services.service";
import {Services} from "../../models/Services";

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit,AfterViewInit {
  @ViewChild('backgroundVideo', { static: false }) backgroundVideo!: ElementRef<HTMLVideoElement>;

  listSettings: Settings[]=[];
  listServices: Services[]=[];
  groupedBrands: any[] = [];
  currentBanner!: string ;
  addForm!: FormGroup;

  constructor(
      private settingsService: SettingsService,
      private servicesService: ServicesService,
      private cdr: ChangeDetectorRef,
      private sweetAlertService:SweetAlertService,
      private formBuilder: FormBuilder,
      private router: Router,

  ) {}

  ngOnInit(): void {
    // this.initializePlugins();
    this.getSettings();
    this.getServices();


    this.addForm = this.formBuilder.group({
      nom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
      objet: [''],
      message: ['', [Validators.required]]
    });

    window.addEventListener("scroll", this.handleScroll);
  }

  ngAfterViewInit(): void {
    this.setCurrentBanner();
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

    if (window.scrollY > 50) {
      headerTop.classList.add("hidden"); // Cacher .header-style-four
      navbarArea.classList.add("scrolled"); // Appliquer le fond gris foncé
    } else {
      headerTop.classList.remove("hidden"); // Afficher .header-style-four en haut de la page
      navbarArea.classList.remove("scrolled"); // Retirer le fond gris foncé
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

}
