import { Component, OnInit } from '@angular/core';
import { LargeElement } from '../../../models/LargeElement';
import { LargeElementService } from '../../../services/large-element.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-large-elements',
  templateUrl: './list-large-elements.component.html',
  styleUrls: ['./list-large-elements.component.scss']
})
export class ListLargeElementsComponent implements OnInit {

  breadCrumbItems: Array<{}> = [];
  listLargeElements: LargeElement[] = [];
  originalListLargeElements: LargeElement[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  length = 0;

  selectedLargeElement!: LargeElement;
  modalRef: any;

  editLargeElementForm!: FormGroup;
  submitted = false;

  constructor(
      private largeElementService: LargeElementService,
      private modalService: NgbModal,
      private sweetAlertService: SweetAlertService,
      private router: Router,
      private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
  this.breadCrumbItems = [
      { label: 'Schwer Möbel' },
      { label: 'Liste', active: true }
    ];

    this.loadLargeElements();

    this.editLargeElementForm = this.formBuilder.group({
      id_largeElement: [{ value: null, disabled: true }],
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
    }, {
      updateOn: 'submit'
    });
  }

  loadLargeElements() {
    this.largeElementService.getAll().subscribe(
        (data: LargeElement[]) => {
          this.originalListLargeElements = data;
          this.listLargeElements = [...this.originalListLargeElements];
          this.length = this.listLargeElements.length;
        },
        error => {
       console.error('Fehler beim Laden der schweren Möbel', error);
        this.sweetAlertService.error('Fehler beim Laden der schweren Möbel');
        }
    );
  }

  pageChanged(event: any): void {
    this.currentPage = event;
  }

  addLargeElement() {
    this.router.navigate(['/pages/largeElement/add']);
  }

  openModal(largeElement: LargeElement, content: any) {
    this.selectedLargeElement = largeElement;
    this.editLargeElementForm.reset({
      id_largeElement: largeElement.id_largeElement,
      name: largeElement.name,
      price: largeElement.price,
    });
    this.submitted = false;
    this.modalRef = this.modalService.open(content, { size: 'md', centered: true });
  }

  confirmDelete(content: any, largeElementId: number) {
    this.selectedLargeElement = this.listLargeElements.find(k => k.id_largeElement === largeElementId)!;
    this.modalRef = this.modalService.open(content, { centered: true });
  }

  deleteLargeElement(largeElementId: number) {
    this.largeElementService.deleteLargeElement(largeElementId).subscribe(
        () => {
          this.listLargeElements = this.listLargeElements.filter(k => k.id_largeElement !== largeElementId);
        this.sweetAlertService.success('Schweres Möbel erfolgreich gelöscht!');
          this.modalRef.close();
          this.loadLargeElements();
        },
        error => {
        this.sweetAlertService.error('Fehler beim Löschen des Möbels');
          console.error(error);
        }
    );
  }

  get f() {
    return this.editLargeElementForm.controls;
  }

saveLargeElement() {
    this.submitted = true;

    if (this.editLargeElementForm.invalid) {
      // Fehlermeldungen bei ungültigem Formular
      if (this.f['name'].invalid) {
        if (this.f['name'].errors?.['required']) {
          this.sweetAlertService.error('Name ist erforderlich');
        } else if (this.f['name'].errors?.['minlength']) {
          this.sweetAlertService.error('Der Name muss mindestens 3 Zeichen lang sein');
        }
        return;
      }

      if (this.f['price'].invalid) {
        if (this.f['price'].errors?.['required']) {
          this.sweetAlertService.error('Preis ist erforderlich');
        } else if (this.f['price'].errors?.['pattern']) {
          this.sweetAlertService.error('Bitte einen gültigen Preis eingeben (z. B. 123.45)');
        }
        return;
      }
      return;
    }

    // Aktualisierung vorbereiten
    const aktualisiertesMöbel = new LargeElement();
    aktualisiertesMöbel.id_largeElement = this.selectedLargeElement.id_largeElement;
    aktualisiertesMöbel.name = this.f['name'].value;
    aktualisiertesMöbel.price = this.f['price'].value;

    // Update ausführen
    this.largeElementService.updateLargeElement(aktualisiertesMöbel.id_largeElement, aktualisiertesMöbel).subscribe(
      () => {
        this.sweetAlertService.success('Schweres Möbel erfolgreich aktualisiert!');
        this.modalRef.close();
        this.loadLargeElements();
      },
      error => {
        this.sweetAlertService.error('Fehler beim Aktualisieren des Möbels');
        console.error(error);
      }
    );
  }

}