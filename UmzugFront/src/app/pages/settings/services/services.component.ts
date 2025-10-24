import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { User } from "../../../models/User";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SweetAlertService } from "../../../services/sweet-alert.service";
import { ServicesService } from "../../../services/services.service";
import { Services } from "../../../models/Services";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  @ViewChild('addServiceModal') addServiceModal: any;
  breadCrumbItems!: Array<{}>;
  listServices!: Services[];
  submitted = false;
  listForm!: FormGroup;
  modal: any;
  total!: Observable<number>;
  fieldTextType!: boolean;
  service: any;
  file: File | undefined;
  selectedService!: Services;
  userLogged!: User;
  servcieIdToDelete!: number;
  length = 0;
  searchName: string = '';
  originalListServices: Services[] = [];
  searchLetter: string = '';
  Services: Services[] = [];
  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  currentPage: any = 1;
  itemsPerPage = 10;
  addForm!: FormGroup;
  public editor = ClassicEditor;
  public editorConfig = {
    toolbar: {
      items: [
        'heading', '|', 'bold', 'italic', 'underline', 'strike', '|',
        'numberedList', 'bulletedList', '|', 'link', '|', 'undo', 'redo'
      ],
    },
    language: 'de',
    placeholder: 'Geben Sie hier Ihren Text ein...',
    height: 200,
    resize_enabled: false
  };

  constructor(
    private servicesService: ServicesService,
    private router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit(): void {

    this.getServices();
    this.loadServices();

    this.breadCrumbItems = [
      { label: 'Dienste' },
      { label: 'Liste', active: true }
    ];

    this.listForm = this.formBuilder.group({
      id_services: [null],
      description: ['', [Validators.required]],
      titre: ['', [Validators.required]],
    });

    this.addForm = this.formBuilder.group({
      description: ['', [Validators.required]],
      titre: ['', [Validators.required]],
    });

    this.userLogged = JSON.parse(localStorage.getItem('currentUser') || '{}').user;
  }

  getServices() {
    this.servicesService.getServices().subscribe((data) => {
      if (data) {
        this.listServices = data;
        this.length = data.length;
      }
    }, (error) => {
      console.log(error);
    });
  }

  openModal(service: Services, content: any) {
    this.selectedService = service;
    this.submitted = false;
    this.listForm.setValue({
      id_services: service.id_services,
      titre: service.titre,
      description: service.description,
    });
    this.modalService.open(content, { size: 'md', centered: true });
  }

  confirm(content: any, id: any) {
    this.servcieIdToDelete = id;
    this.modalService.open(content, { centered: true });
  }

  get form() {
    return this.listForm.controls;
  }

  get f() {
    return this.listForm.controls;
  }

  updateService() {
    const serviceUpdated = new Services();
    if (this.selectedService) {
      serviceUpdated.id_services = this.selectedService.id_services;
      if (this.listForm.value.titre) {
        serviceUpdated.titre = this.listForm.value.titre;
      }
      if (this.listForm.value.description) {
        serviceUpdated.description = this.listForm.value.description;
      }

      this.servicesService.updateServices(serviceUpdated).subscribe((result) => {
        this.sweetAlertService.success('Dienst erfolgreich aktualisiert');
        setTimeout(() => {}, 2000);
        this.getServices();
        this.modalService.dismissAll();
      }, error => {
        this.sweetAlertService.danger('Fehler beim Aktualisieren des Dienstes!');
      });
    }
  }

  add() {
    this.router.navigate(['/pages/settings/services/add']);
  }

  deleteService() {
    if (this.servcieIdToDelete) {
      this.servicesService.deleteServices(this.servcieIdToDelete).subscribe((response) => {
        if (response) {
          this.listServices = this.listServices.filter((item) => item.id_services !== this.servcieIdToDelete);
        }
      });
      this.modalService.dismissAll();
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  filterServices() {
    if (this.searchName || this.searchLetter) {
      this.listServices = this.originalListServices.filter(service => {
        const fullName = `${service.titre}`;
        const fullNameLowerCase = fullName.toLowerCase();
        const nameFilter = this.searchName && fullNameLowerCase.includes(this.searchName.toLowerCase());
        const letterFilter = this.searchLetter && service.titre.toLowerCase().startsWith(this.searchLetter.toLowerCase());

        return nameFilter || letterFilter;
      });
    } else {
      this.listServices = this.originalListServices;
    }
  }

  loadServices() {
    this.servicesService.getServices().subscribe(
      (data: Services[]) => {
        this.originalListServices = data;
        this.listServices = [...this.originalListServices];
      },
      error => {
        console.error('Fehler beim Laden der Dienste', error);
      }
    );
  }

  onLetterClick(letter: string) {
    this.searchLetter = letter;
    this.filterServices();
  }

  pageChanged(event: any): void {
    this.currentPage = event;
  }

  saveService() {
    const newService = new Services();
    newService.titre = this.addForm.value.titre;
    newService.description = this.addForm.value.description;

    this.servicesService.addServices(newService).subscribe((result) => {
        this.getServices();
        this.sweetAlertService.success('Dienst erfolgreich hinzugefügt');
        setTimeout(() => {
          this.router.navigate(['pages/settings/services']);
        }, 1000);
      },
      error => {
        this.sweetAlertService.danger('Fehler beim Hinzufügen des Dienstes!');
      });

    this.modalService.dismissAll();
  }

  openAddModal() {
    this.modalService.open(this.addServiceModal);
  }
}
