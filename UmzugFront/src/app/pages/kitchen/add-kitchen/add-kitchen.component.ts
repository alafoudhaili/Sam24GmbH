import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { KitchenService } from '../../../services/kitchen.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { Kitchen } from '../../../models/Kitchen';

@Component({
  selector: 'app-add-kitchen',
  templateUrl: './add-kitchen.component.html',
  styleUrls: ['./add-kitchen.component.scss']
})
export class AddKitchenComponent {
  
  breadCrumbItems: Array<{}> = [];
  addKitchenForm!: FormGroup;
  fieldTextType!: boolean;
  
  constructor(
    private router: Router,
    private kitchenservice: KitchenService,
    private formBuilder: FormBuilder,
    private sweetAlertService: SweetAlertService,
  ) { }
  
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Küche' },
      { label: 'hinzufügen', active: true },
    ];
    
    this.addKitchenForm = this.formBuilder.group({
      assemblage: [false],
      dessemblage: [false],
      transportKitchen: [false],
      newKitchen: [false],
      meters: [5, [Validators.min(5)]],
      price: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
    });

    // Listen to all relevant changes to auto-calculate price
    this.addKitchenForm.get('assemblage')?.valueChanges.subscribe(() => this.calculatePrice());
    this.addKitchenForm.get('dessemblage')?.valueChanges.subscribe(() => this.calculatePrice());
    this.addKitchenForm.get('transportKitchen')?.valueChanges.subscribe(() => this.calculatePrice());
    this.addKitchenForm.get('newKitchen')?.valueChanges.subscribe(() => this.calculatePrice());
    this.addKitchenForm.get('meters')?.valueChanges.subscribe(() => this.calculatePrice());
    
    // Initial calculation
    this.calculatePrice();
  }
  
  calculatePrice(): void {
    const assemblage = this.addKitchenForm.get('assemblage')?.value;
    const dessemblage = this.addKitchenForm.get('dessemblage')?.value;
    const transportKitchen = this.addKitchenForm.get('transportKitchen')?.value;
    const newKitchen = this.addKitchenForm.get('newKitchen')?.value;
    const meters = this.addKitchenForm.get('meters')?.value || 5;

    let totalPrice = 0;

    // Case 1: Transport only
    if (transportKitchen && !assemblage && !dessemblage) {
      totalPrice = newKitchen ? 250 : 150;
    }
    
    // Case 2: Demontage only (only for old kitchens)
    else if (dessemblage && !assemblage && !transportKitchen) {
      totalPrice = 150;
      // Force newKitchen to false for demontage only
      if (newKitchen) {
        this.addKitchenForm.patchValue({ newKitchen: false }, { emitEvent: false });
      }
    }
     else if (dessemblage && assemblage && !transportKitchen) {
      totalPrice = 150;
            const pricePerMeter = newKitchen ? 180 : 110;
totalPrice = totalPrice + pricePerMeter * meters
      // Force newKitchen to false for demontage only
     
    }
    // Case 3: Montage only
    else if (assemblage && !transportKitchen && !dessemblage) {
      const pricePerMeter = newKitchen ? 180 : 110;
      totalPrice = pricePerMeter * meters;
    }
    
    // Case 4: Montage + Transport
    else if (assemblage && transportKitchen && !dessemblage) {
      const pricePerMeter = newKitchen ? 180 : 110;
      const montagePrice = pricePerMeter * meters;
      const transportPrice = newKitchen ? 250 : 150;
      totalPrice = montagePrice + transportPrice;
    }
    
    // Case 5: Other combinations (manual price entry)
    else {
      // Allow manual price entry for other combinations
      return;
    }

    this.addKitchenForm.patchValue({ price: totalPrice.toFixed(2) }, { emitEvent: false });
  }
  
  saveKitchen() {
    if (this.addKitchenForm.valid) {
      const newKitchen = new Kitchen();
      newKitchen.assemblage = this.addKitchenForm.value.assemblage;
      newKitchen.dessemblage = this.addKitchenForm.value.dessemblage;
      newKitchen.transportKitchen = this.addKitchenForm.value.transportKitchen;
      newKitchen.newKitchen = this.addKitchenForm.value.newKitchen;
      newKitchen.price = this.addKitchenForm.value.price;
            newKitchen.meters = this.addKitchenForm.value.meters;

      this.kitchenservice.addKitchens(newKitchen).subscribe(
        () => {
          this.sweetAlertService.success('Küche erfolgreich hinzugefügt!');
          setTimeout(() => {
            this.router.navigate(['/pages/kitchen']);
          }, 1000);
        },
        () => {
          this.sweetAlertService.danger('Fehler beim Hinzufügen der Küche!');
        }
      );
    }
  }
  
  get f() {
    return this.addKitchenForm.controls;
  }
  
  list() {
    this.router.navigate(['kitchen']);
  }
  
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  
  checkValidityAndSubmit() {
    if (this.addKitchenForm.invalid) {
      if (this.f['price'].invalid) {
        if (this.f['price'].errors?.['required']) {
          this.sweetAlertService.danger('Das Feld Preis ist ein Pflichtfeld!');
        } else if (this.f['price'].errors?.['pattern']) {
          this.sweetAlertService.danger('Bitte geben Sie einen gültigen Preis ein (z.B. 123.45).');
        }
        return;
      }
      return;
    }
    this.saveKitchen();
  }
}