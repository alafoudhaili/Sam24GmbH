import { Component, OnInit } from '@angular/core';
import { Element } from '../../../models/Element';
import { ElementService } from '../../../services/element.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-elements',
  templateUrl: './list-elements.component.html',
  styleUrls: ['./list-elements.component.scss']
})
export class ListElementsComponent implements OnInit {

  breadCrumbItems: Array<{}> = [];
  listElements: Element[] = [];
  originalListElements: Element[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  length = 0;

  selectedElement!: Element;
  modalRef: any;

  editElementForm!: FormGroup;
  submitted = false;

  constructor(
      private elementService: ElementService,
      private modalService: NgbModal,
      private sweetAlertService: SweetAlertService,
      private router: Router,
      private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Elements' },
      { label: 'List', active: true }
    ];

    this.loadElements();

    this.editElementForm = this.formBuilder.group({
      id_element: [{ value: null, disabled: true }],
      name: ['', [Validators.required, Validators.minLength(3)]],
      width: ['', [Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
      height: ['', [Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
      length: ['', [Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
      re: [''],
      q2: [''],
      price: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
    }, {
      updateOn: 'submit'
    });
  }

  loadElements() {
    this.elementService.getAll().subscribe(
        (data: Element[]) => {
          this.originalListElements = data;
          this.listElements = [...this.originalListElements];
          this.length = this.listElements.length;
        },
        error => {
          console.error('Error loading elements', error);
          this.sweetAlertService.error('Error loading elements');
        }
    );
  }

  pageChanged(event: any): void {
    this.currentPage = event;
  }

  addElement() {
    this.router.navigate(['/pages/element/add']);
  }

  openModal(element: Element, content: any) {
    this.selectedElement = element;
    this.editElementForm.reset({
      id_element: element.id_element,
      name: element.name,
      width: element.width,
      height: element.height,
      length: element.length,
      q2: element.q2,
      price: element.price,
      re:element.re
    });
    this.submitted = false;
    this.modalRef = this.modalService.open(content, { size: 'lg', centered: true });
  }

  confirmDelete(content: any, elementId: number) {
    this.selectedElement = this.listElements.find(e => e.id_element === elementId)!;
    this.modalRef = this.modalService.open(content, { centered: true });
  }

  deleteElement(elementId: number) {
    this.elementService.delete(elementId).subscribe(
        () => {
          this.listElements = this.listElements.filter(e => e.id_element !== elementId);
          this.sweetAlertService.success('Element deleted successfully');
          this.modalRef.close();
          this.loadElements();
        },
        error => {
          this.sweetAlertService.error('Error deleting element');
          console.error(error);
        }
    );
  }

  get f() {
    return this.editElementForm.controls;
  }
calculateQ2AndPrice() {
    const width = this.editElementForm.value.width || 0;
    const height = this.editElementForm.value.height || 0;
    const length = this.editElementForm.value.length || 0;
    const re = this.editElementForm.value.re || 0;  // RE value from form

    // If RE is entered, calculate the Q2 and reverse calculate the dimensions (assuming a cube shape for simplicity)
    if (re && !width && !height && !length) {
        const q2FromRe = (parseFloat(re) * 0.1).toFixed(2); // 10 RE = 1 Q2
        const priceFromRe = (parseFloat(q2FromRe) * 35).toFixed(2); // 1 Q2 = 35 euro

        // Reverse calculate the dimensions from Q2
        const calculatedDimensions = this.calculateDimensionsFromQ2(q2FromRe); // Method to reverse calculate dimensions

        this.editElementForm.patchValue({
            q2: q2FromRe,
            price: priceFromRe,
            width: calculatedDimensions.width,
            height: calculatedDimensions.height,
            length: calculatedDimensions.length
        }, { emitEvent: false });
    }

    // If dimensions (width, height, length) are entered, calculate Q2 and RE
        const q2 = (parseFloat(width) * parseFloat(height) * parseFloat(length)).toFixed(2); // Calculate Q2
        const price = (parseFloat(q2) * 35).toFixed(2); // 1 Q2 = 35 euro

        // Calculate RE based on Q2 (10 RE = 1 Q2)
        const calculatedRe = (parseFloat(q2) * 10); // RE = Q2 * 10

        // Update Q2, RE, and price based on dimensions
        this.editElementForm.patchValue({
            q2: q2,
            re: calculatedRe,
            price: price
        }, { emitEvent: false });
    
}

// Helper method to reverse calculate dimensions from Q2
calculateDimensionsFromQ2(q2: string) {
    const volume = parseFloat(q2); // Q2 is volume (width * height * length)

    // Simple approximation, assuming cube shape for simplicity.
    const side = Math.cbrt(volume); // Get a rough estimate for dimensions
    return {
        width: side.toFixed(2),
        height: side.toFixed(2),
        length: side.toFixed(2)
    };
}
onReBlur() {
    const re = this.editElementForm.value.re || 0;  // Get the value of RE

    if (re) {
        const q2FromRe = (parseFloat(re) * 0.1).toFixed(2); // 10 RE = 1 Q2
        const priceFromRe = (parseFloat(q2FromRe) * 35).toFixed(2); // 1 Q2 = 35 euro

        // Reverse calculate the dimensions from Q2
        const calculatedDimensions = this.calculateDimensionsFromQ2(q2FromRe); // Method to reverse calculate dimensions

        this.editElementForm.patchValue({
            q2: q2FromRe,
            price: priceFromRe,
            width: calculatedDimensions.width,
            height: calculatedDimensions.height,
            length: calculatedDimensions.length
        });
    }
}
  saveElement() {
    this.submitted = true;

    if (this.editElementForm.invalid) {
      if (this.f['name'].invalid) {
        if (this.f['name'].errors?.['required']) {
          this.sweetAlertService.error('Name is required');
        } else if (this.f['name'].errors?.['minlength']) {
          this.sweetAlertService.error('Name must be at least 3 characters long');
        }
        return;
      }

      if (this.f['price'].invalid) {
        if (this.f['price'].errors?.['required']) {
          this.sweetAlertService.error('Price is required');
        } else if (this.f['price'].errors?.['pattern']) {
          this.sweetAlertService.error('Please enter a valid price (e.g. 123.45)');
        }
        return;
      }
      return;
    }

    const updatedElement = new Element();
    updatedElement.id_element = this.selectedElement.id_element;
    updatedElement.name = this.f['name'].value;
    updatedElement.width = this.f['width'].value;
    updatedElement.height = this.f['height'].value;
    updatedElement.length = this.f['length'].value;
    updatedElement.q2 = this.f['q2'].value;
    updatedElement.price = this.f['price'].value;
    updatedElement.re = this.f['re'].value;

    this.elementService.update(updatedElement).subscribe(
        () => {
          this.sweetAlertService.success('Element updated successfully!');
          this.modalRef.close();
          this.loadElements();
        },
        error => {
          this.sweetAlertService.error('Error updating element');
          console.error(error);
        }
    );
  }
}