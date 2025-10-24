import { Component, OnInit } from '@angular/core';
import { Kitchen } from '../../../models/Kitchen';
import { KitchenService } from '../../../services/kitchen.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

// Validator: exactly one of the booleans must be true
/*export const exactlyOneTrueValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const assemblage = control.get('assemblage')?.value;
  const dessemblage = control.get('dessemblage')?.value;
  const transportKitchen = control.get('transportKitchen')?.value;

  const trueCount = [assemblage, dessemblage, transportKitchen].filter(v => v === true).length;
  return trueCount === 1 ? null : { exactlyOneTrue: true };
}; */

@Component({
  selector: 'app-list-kitchens',
  templateUrl: './list-kitchens.component.html',
  styleUrls: ['./list-kitchens.component.scss']
})
export class ListKitchensComponent implements OnInit {

  breadCrumbItems: Array<{}> = [];
  listKitchens: Kitchen[] = [];
  originalListKitchens: Kitchen[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  length = 0;

  selectedKitchen!: Kitchen;
  modalRef: any;

  editKitchenForm!: FormGroup;
  submitted = false;

  currentFilter: 'all' | 'assemblage' | 'dessemblage' | 'transportKitchen' = 'all';

  constructor(
    private kitchenService: KitchenService,
    private modalService: NgbModal,
    private sweetAlertService: SweetAlertService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Küchen' },
      { label: 'Liste', active: true }
    ];

    this.loadKitchens();

    this.editKitchenForm = this.formBuilder.group({
      id_Kitchen: [{ value: null, disabled: true }],
      assemblage: [false],     // no individual Validators.requiredTrue
      dessemblage: [false],
      transportKitchen: [false],
      price: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
    },/* {
      validators: exactlyOneTrueValidator,
      updateOn: 'submit'
    }*/);
  }

  loadKitchens() {
    this.kitchenService.getKitchens().subscribe(
      (data: Kitchen[]) => {
        this.originalListKitchens = data;
        this.applyFilter();
      },
      error => {
        console.error('Fehler beim Laden der Küchen', error);
      }
    );
  }

  applyFilter() {
    switch (this.currentFilter) {
      case 'assemblage':
        this.listKitchens = this.originalListKitchens.filter(k => k.assemblage === true);
        break;
      case 'dessemblage':
        this.listKitchens = this.originalListKitchens.filter(k => k.dessemblage === true);
        break;
      case 'transportKitchen':
        this.listKitchens = this.originalListKitchens.filter(k => k.transportKitchen === true);
        break;
      default:
        this.listKitchens = [...this.originalListKitchens];
    }
    this.length = this.listKitchens.length;
    this.currentPage = 1;
  }

  setFilter(filter: 'all' | 'assemblage' | 'dessemblage' | 'transportKitchen') {
    this.currentFilter = filter;
    this.applyFilter();
  }

  pageChanged(event: any): void {
    this.currentPage = event;
  }

  addKitchen() {
    this.router.navigate(['/pages/kitchen/add']);
  }

  openModal(kitchen: Kitchen, content: any) {
    this.selectedKitchen = kitchen;
    console.log(kitchen)
    this.editKitchenForm.reset({
      id_Kitchen: kitchen.id_kitchen,
      assemblage: kitchen.assemblage,
      dessemblage: kitchen.dessemblage,
      transportKitchen: kitchen.transportKitchen,
      price: kitchen.price,
    });
    this.submitted = false;
    this.modalRef = this.modalService.open(content, { size: 'md', centered: true });
  }

  confirmDelete(content: any, kitchenId: number) {
    this.selectedKitchen = this.listKitchens.find(k => k.id_kitchen === kitchenId)!;
    this.modalRef = this.modalService.open(content, { centered: true });
  }

  deleteKitchen(kitchenId: number) {
    this.kitchenService.deleteKitchen(kitchenId).subscribe(
      () => {
        this.listKitchens = this.listKitchens.filter(k => k.id_kitchen !== kitchenId);
        this.sweetAlertService.success('Küche erfolgreich gelöscht');
        this.modalRef.close();
      },
      error => {
        this.sweetAlertService.danger('Fehler beim Löschen der Küche');
        console.error(error);
      }
    );
  }

  get f() {
    return this.editKitchenForm.controls;
  }

  saveKitchen() {
    this.submitted = true;

    if (this.editKitchenForm.invalid) {
      

      if (this.f['price'].invalid) {
        if (this.f['price'].errors?.['required']) {
          this.sweetAlertService.danger('Preis ist erforderlich.');
        } else if (this.f['price'].errors?.['pattern']) {
          this.sweetAlertService.danger('Bitte geben Sie einen gültigen Preis ein (z.B. 123.45).');
        }
        return;
      }
      return;
    }

    const updatedKitchen = new Kitchen();
    updatedKitchen.id_kitchen = this.selectedKitchen.id_kitchen;
    updatedKitchen.assemblage = this.f['assemblage'].value;
    updatedKitchen.dessemblage = this.f['dessemblage'].value;
    updatedKitchen.transportKitchen = this.f['transportKitchen'].value;
    updatedKitchen.price = this.f['price'].value;

    this.kitchenService.updateKitchen(updatedKitchen).subscribe(
      () => {
        this.sweetAlertService.success('Küche erfolgreich aktualisiert!');
        this.modalRef.close();
        this.loadKitchens();
      },
      error => {
        this.sweetAlertService.danger('Fehler beim Aktualisieren der Küche');
        console.error(error);
      }
    );
  }

}
