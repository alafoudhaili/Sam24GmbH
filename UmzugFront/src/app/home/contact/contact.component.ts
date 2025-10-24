import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Settings} from "../../models/Settings";
import {SettingsService} from "../../services/settings.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SweetAlertService} from "../../services/sweet-alert.service";
import {MessageLandingService} from "../../services/message-landing.service";
import {MessageLanding} from "../../models/MessageLanding";
import {Router} from "@angular/router";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit,AfterViewInit {
  @ViewChild('backgroundVideo', { static: false }) backgroundVideo!: ElementRef<HTMLVideoElement>;

  listSettings: Settings[]=[];
  groupedBrands: any[] = [];
  currentBanner!: string ;
  addForm!: FormGroup;

  constructor(
      private settingsService: SettingsService,
      private messageLandingService: MessageLandingService,
      private cdr: ChangeDetectorRef,
      private sweetAlertService:SweetAlertService,
      private formBuilder: FormBuilder,
      private router: Router,

  ) {}

  ngOnInit(): void {
    // this.initializePlugins();
    this.getSettings();

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





  checkValidityAndSubmit() {
    if (this.addForm.invalid) {
      for (const i in this.addForm.controls) {
        if (this.addForm.controls[i].invalid) {
 switch (i) {
  case 'nom':
    this.sweetAlertService.danger('Name ist erforderlich!');
    break;
  case 'email':
    this.sweetAlertService.danger('E-Mail ist erforderlich!');
    break;
  case 'telephone':
    this.sweetAlertService.danger('Telefonnummer ist erforderlich!');
    break;
  case 'message':
    this.sweetAlertService.danger('Nachricht ist erforderlich!');
    break;
}
          return;
        }
      }
    }
    else {
        this.sendMessage();
      }
    }


   sendMessage() {
     if (this.addForm.valid) {
       const newMessage = new MessageLanding();
       newMessage.nom = this.addForm.value.nom;
       newMessage.telephone = this.addForm.value.telephone;
       newMessage.email = this.addForm.value.email;
       newMessage.objet = this.addForm.value.objet;
       newMessage.message = this.addForm.value.message;

       this.messageLandingService.addMessage(newMessage).subscribe((result) => {
             this.sweetAlertService.success('Nachricht erfolgreich gesendet');
             setTimeout(() => {
               this.router.navigate([''])
             }, 1000)
           }
           , error => {
             this.sweetAlertService.danger('Problem beim Senden der Nachricht!');
           });
     }
  }
  formatTime(time: string): Date | null {
    return time ? new Date(`1970-01-01T${time}`) : null;
  }
}

