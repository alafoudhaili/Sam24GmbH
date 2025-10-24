import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LargeElement } from '../../../models/LargeElement';
import { LargeElementService } from '../../../services/large-element.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';

@Component({
  selector: 'app-add-large-element',
  templateUrl: './add-large-element.component.html',
  styleUrls: ['./add-large-element.component.scss']
})
export class AddLargeElementComponent {

  breadCrumbItems: Array<{}> = [];
  addLargeElementForm!: FormGroup;

  constructor(
      private router: Router,
      private largeElementService: LargeElementService,
      private formBuilder: FormBuilder,
      private sweetAlertService: SweetAlertService,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Large Elements' },
      { label: 'Add', active: true },
    ];

    this.addLargeElementForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
    });
  }

  saveLargeElement() {
    if (this.addLargeElementForm.valid) {
      const newLargeElement = new LargeElement();
      newLargeElement.name = this.addLargeElementForm.value.name;
      newLargeElement.price = this.addLargeElementForm.value.price;

      this.largeElementService.addLargeElement(newLargeElement).subscribe(
          () => {
            this.sweetAlertService.success('Large element added successfully!');
            setTimeout(() => {
              this.router.navigate(['/pages/largeElement']);
            }, 1000);
          },
          () => {
            this.sweetAlertService.danger('Error while adding large element!');
          }
      );
    }
  }

  get f() {
    return this.addLargeElementForm.controls;
  }

  list() {
    this.router.navigate(['/pages/largeElement']);
  }

  checkValidityAndSubmit() {
    if (this.addLargeElementForm.invalid) {
      if (this.f['name'].invalid) {
        if (this.f['name'].errors?.['required']) {
          this.sweetAlertService.danger('Name field is required!');
        } else if (this.f['name'].errors?.['minlength']) {
          this.sweetAlertService.danger('Name must be at least 3 characters long.');
        }
        return;
      }

      if (this.f['price'].invalid) {
        if (this.f['price'].errors?.['required']) {
          this.sweetAlertService.danger('Price field is required!');
        } else if (this.f['price'].errors?.['pattern']) {
          this.sweetAlertService.danger('Please enter a valid price (e.g. 123.45).');
        }
        return;
      }
      return;
    }
    this.saveLargeElement();
  }
}