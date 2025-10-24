import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ElementService } from '../../../services/element.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { Element } from '../../../models/Element';

@Component({
  selector: 'app-add-element',
  templateUrl: './add-element.component.html',
  styleUrls: ['./add-element.component.scss']
})
export class AddElementComponent {

  breadCrumbItems: Array<{}> = [];
  addElementForm!: FormGroup;

  constructor(
      private router: Router,
      private elementService: ElementService,
      private formBuilder: FormBuilder,
      private sweetAlertService: SweetAlertService,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Möbel' },
      { label: 'hinzufügen', active: true },
    ];

    this.addElementForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      width: ['', [Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
      height: ['', [Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
      length: ['', [Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
      q2: [''],
      re: [''],
      price: ['' ],
    });

  }
calculateQ2AndPrice() {
    const width = this.addElementForm.value.width || 0;
    const height = this.addElementForm.value.height || 0;
    const length = this.addElementForm.value.length || 0;
    const re = this.addElementForm.value.re || 0;  // RE value from form

    // If RE is entered, calculate the Q2 and reverse calculate the dimensions (assuming a cube shape for simplicity)
    if (re && !width && !height && !length) {
        const q2FromRe = (parseFloat(re) * 0.1).toFixed(2); // 10 RE = 1 Q2
        const priceFromRe = (parseFloat(q2FromRe) * 35).toFixed(2); // 1 Q2 = 35 euro

        // Reverse calculate the dimensions from Q2
        const calculatedDimensions = this.calculateDimensionsFromQ2(q2FromRe); // Method to reverse calculate dimensions

        this.addElementForm.patchValue({
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
        this.addElementForm.patchValue({
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
    const re = this.addElementForm.value.re || 0;  // Get the value of RE

    if (re) {
        const q2FromRe = (parseFloat(re) * 0.1).toFixed(2); // 10 RE = 1 Q2
        const priceFromRe = (parseFloat(q2FromRe) * 35).toFixed(2); // 1 Q2 = 35 euro

        // Reverse calculate the dimensions from Q2
        const calculatedDimensions = this.calculateDimensionsFromQ2(q2FromRe); // Method to reverse calculate dimensions

        this.addElementForm.patchValue({
            q2: q2FromRe,
            price: priceFromRe,
            width: calculatedDimensions.width,
            height: calculatedDimensions.height,
            length: calculatedDimensions.length
        });
    }
}
  saveElement() {
    if (this.addElementForm.valid) {
      const newElement = new Element();
      newElement.name = this.addElementForm.value.name;
      newElement.width = this.addElementForm.value.width;
      newElement.height = this.addElementForm.value.height;
      newElement.length = this.addElementForm.value.length;
      newElement.q2 = this.addElementForm.value.q2;
      newElement.price = this.addElementForm.value.price;
      newElement.re = this.addElementForm.value.re;

      this.elementService.save(newElement).subscribe(
          () => {
            this.sweetAlertService.success('Element added successfully!');
            setTimeout(() => {
              this.router.navigate(['/pages/element']);
            }, 1000);
          },
          (error) => {
            this.sweetAlertService.error('Error while adding element!');
            console.error(error);
          }
      );
    }
  }

  get f() {
    return this.addElementForm.controls;
  }

  list() {
    this.router.navigate(['element']);
  }

  checkValidityAndSubmit() {
    if (this.addElementForm.invalid) {
      if (this.f['name'].invalid) {
        if (this.f['name'].errors?.['required']) {
          this.sweetAlertService.error('Name field is required!');
        } else if (this.f['name'].errors?.['minlength']) {
          this.sweetAlertService.error('Name must be at least 3 characters long.');
        }
        return;
      }

      if (this.f['price'].invalid) {
        if (this.f['price'].errors?.['required']) {
          this.sweetAlertService.error('Price field is required!');
        } else if (this.f['price'].errors?.['pattern']) {
          this.sweetAlertService.error('Please enter a valid price (e.g. 123.45).');
        }
        return;
      }
      return;
    }
    this.saveElement();
  }
}