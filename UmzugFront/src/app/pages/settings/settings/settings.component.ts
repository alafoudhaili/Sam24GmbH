import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "../../../models/User";
import { SettingsService } from "../../../services/settings.service";
import { Settings } from "../../../models/Settings";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  breadCrumbItems: Array<{}> = [];
  listForm!: FormGroup;
  userLogged!: User;
  listSettings: Settings[] = [];
  selectedSettings!: Settings;
  submitted = false;
  file: File | undefined;
  fileBanner: any;
  previewLogoUrl: string | null = null;

  @ViewChild('addSettingsModal') addSettingsModal: any;
  settingsForm!: FormGroup;
  public editor = ClassicEditor;
  public editorConfig = {
    toolbar: {
      items: [
        'heading', '|', 'bold', 'italic', 'underline', 'strike', '|',
        'numberedList', 'bulletedList', '|', 'link', '|', 'undo', 'redo'
      ],
    },
    language: 'de',  // Translated to German
    placeholder: 'Geben Sie hier Ihren Text ein...',
    height: 200,
    resize_enabled: false
  };

  constructor(
    private settingsService: SettingsService,
    private router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getSettings();

    this.breadCrumbItems = [
      { label: 'Einstellungen' },  // Translated to "Settings"
      { label: 'Allgemein', active: true }  // Translated to "General"
    ];

    this.listForm = this.formBuilder.group({
      id_settings: [null],
      apropos: [''],
      apropos2: [''],
      apropos3: [''],
      objective: [''],
      mission: [''],
      vision: [''],
      motto: [''],
      titreService: [''],
      titre: [''],
      adresse: [''],
      telephone: [''],
      email: [''],
      whatsapp: [''],
      logo: [''],
      banner: [''],
      dimensionLogo: [''],
      heureDebut: ['', Validators.required],  // "heureDebut" remains as is
      heureFin: ['', Validators.required]  // "heureFin" remains as is
    });

    this.settingsForm = this.formBuilder.group({
      apropos: [''],
      apropos2: [''],
      apropos3: [''],
      objective: [''],
      mission: [''],
      vision: [''],
      motto: [''],
      titreService: [''],
      titre: [''],
      adresse: [''],
      telephone: [''],
      email: [''],
      whatsapp: [''],
      logo: [''],
      banner: [''],
      dimensionLogo: [''],
      heureDebut: ['', Validators.required],  // "heureDebut" remains as is
      heureFin: ['', Validators.required]  // "heureFin" remains as is
    });

    this.userLogged = JSON.parse(localStorage.getItem('currentUser') || '{}').user;
  }

  getSettings(): void {
    this.settingsService.getSettings().subscribe(
      (settings) => {
        if (settings) {
          this.listSettings = settings;
        }
      },
      (error) => {
        console.error('Fehler beim Abrufen der Einstellungen', error);  // Translated to "Error retrieving settings"
      }
    );
  }

  openEditModal(settings: Settings, content: any) {
    this.selectedSettings = settings;
    this.submitted = false;
    this.listForm.setValue({
      id_settings: settings.id_settings,
      apropos: settings.apropos,
      apropos2: settings.apropos2,
      apropos3: settings.apropos3,
      objective: settings.objective,
      mission: settings.mission,
      vision: settings.vision,
      motto: settings.motto,
      titreService: settings.titreService,
      titre: settings.titre,
      adresse: settings.adresse,
      telephone: settings.telephone,
      email: settings.email,
      whatsapp: settings.whatsapp,
      logo: settings.logo,
      banner: settings.banner,
      dimensionLogo: settings.dimensionLogo,
      heureDebut: settings.heureDebut,
      heureFin: settings.heureFin,
    });
    this.modalService.open(content, { size: 'md', centered: true });
  }

  get form() {
    return this.listForm.controls;
  }

  updateSettings() {
    const settingsUpdated = new Settings();
    if (this.selectedSettings && this.listForm.valid) {
      settingsUpdated.id_settings = this.selectedSettings.id_settings;
      settingsUpdated.apropos = this.listForm.value.apropos || settingsUpdated.apropos;
      settingsUpdated.apropos2 = this.listForm.value.apropos2 || settingsUpdated.apropos2;
      settingsUpdated.apropos3 = this.listForm.value.apropos3 || settingsUpdated.apropos3;
      settingsUpdated.objective = this.listForm.value.objective || settingsUpdated.objective;
      settingsUpdated.mission = this.listForm.value.mission || settingsUpdated.mission;
      settingsUpdated.vision = this.listForm.value.vision || settingsUpdated.vision;
      settingsUpdated.motto = this.listForm.value.motto || settingsUpdated.motto;
      settingsUpdated.titreService = this.listForm.value.titreService || settingsUpdated.titreService;
      settingsUpdated.titre = this.listForm.value.titre || settingsUpdated.titre;
      settingsUpdated.adresse = this.listForm.value.adresse || settingsUpdated.adresse;
      settingsUpdated.telephone = this.listForm.value.telephone || settingsUpdated.telephone;
      settingsUpdated.email = this.listForm.value.email || settingsUpdated.email;
      settingsUpdated.whatsapp = this.listForm.value.whatsapp || settingsUpdated.whatsapp;
      settingsUpdated.dimensionLogo = this.listForm.value.dimensionLogo || settingsUpdated.dimensionLogo;
      settingsUpdated.heureDebut = this.listForm.value.heureDebut;
      settingsUpdated.heureFin = this.listForm.value.heureFin;
      const formData = new FormData();
      formData.append('settings', JSON.stringify(settingsUpdated));

      if (this.file) {
        formData.append('logo', this.file);
      }
      if (this.fileBanner) {
        formData.append('banner', this.fileBanner);
      }

      console.log("settingsUpdated mit FormData ", settingsUpdated);  // Translated to "settingsUpdated with FormData"

      this.settingsService.updateSettings(formData).subscribe(
        (data) => {
          if (data) {
            this.getSettings();
          } else {
            console.log('Fehler bei der Aktualisierung.');
          }
        },
        (error) => {
          console.error('Fehler bei der Aktualisierung der Einstellungen', error);  // Translated to "Error updating settings"
        }
      );

      this.modalService.dismissAll();
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0] as File;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewLogoUrl = reader.result as string; // Temporary preview
      };
      reader.readAsDataURL(this.file);
    }
  }

  onFileBannerChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0] as File;
      const supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const supportedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (supportedImageTypes.includes(file.type) || supportedVideoTypes.includes(file.type)) {
        this.fileBanner = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.selectedSettings.banner = reader.result as string; // Update banner preview
        };
        reader.readAsDataURL(file);
      } else {
        console.error('Die Datei muss ein Bild oder ein Video in den folgenden Formaten sein: JPEG, PNG, GIF, MP4, WebM, OGG.');
        this.fileBanner = null;
      }
    }
  }

  openAddModal() {
    this.modalService.open(this.addSettingsModal);
  }

  saveSettings() {
    const newSettings = this.settingsForm.value;
    newSettings.apropos = this.settingsForm.value.apropos;
    newSettings.apropos2 = this.settingsForm.value.apropos2;
    newSettings.apropos3 = this.settingsForm.value.apropos3;
    newSettings.objective = this.settingsForm.value.objective;
    newSettings.mission = this.settingsForm.value.mission;
    newSettings.vision = this.settingsForm.value.vision;
    newSettings.motto = this.settingsForm.value.motto;
    newSettings.titreService = this.settingsForm.value.titreService;
    newSettings.titre = this.settingsForm.value.titre;
    newSettings.adresse = this.settingsForm.value.adresse;
    newSettings.telephone = this.settingsForm.value.telephone;
    newSettings.email = this.settingsForm.value.email;
    newSettings.whatsapp = this.settingsForm.value.whatsapp;
    newSettings.logo = this.settingsForm.value.logo;
    newSettings.banner = this.settingsForm.value.banner;
    newSettings.dimensionLogo = this.settingsForm.value.dimensionLogo;
    newSettings.heureDebut = this.settingsForm.value.heureDebut;
    newSettings.heureFin = this.settingsForm.value.heureFin;
    const formData = new FormData();
    formData.append('settings', JSON.stringify(newSettings));
    if (newSettings.logo && this.file) {
      formData.append('logo', this.file);
    }
    if (newSettings.banner && this.fileBanner) {
      formData.append('banner', this.fileBanner);
    }
    this.settingsService.addSettings(formData).subscribe(
      (data) => {
        if (data) {
          this.getSettings();
        } else {
          console.log('Fehler');
        }
      },
      (error) => {
        console.error('Fehler bei der Aktualisierung der Einstellungen', error);  // Translated to "Error updating settings"
      }
    );

    this.modalService.dismissAll();
  }

  isImage(bannerUrl: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = bannerUrl.split('.').pop()?.toLowerCase();
    return extension ? imageExtensions.includes(extension) : false;
  }

  isVideo(bannerUrl: string): boolean {
    const videoExtensions = ['mp4', 'webm', 'ogg'];
    const extension = bannerUrl.split('.').pop()?.toLowerCase();
    return extension ? videoExtensions.includes(extension) : false;
  }

  formatTime(time: string): Date | null {
    return time ? new Date(`1970-01-01T${time}`) : null;
  }

}
