import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UmzugService } from 'src/app/services/umzug.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';

export interface Room {
  id_room: number;
  name: string;
}

export interface Kitchen {
  id_kitchen: number;
  assemblage: boolean;
  dessemblage: boolean;
  transportKitchen: boolean;
  price: number;
   meters?: number;  // ADD THIS
         newKitchen: boolean ;
}

export interface Mobel {
  id?: number;
  name: string;
  width: number;
  numberElement:number;
  height: number;
  length: number;
  q2: number;
  price:number;
    imagePreview?: string; // Add this field for image preview
imageUrl?:any
}

export interface Request {
  id_request?: number;
  clientName: string;
  clientEmail: string;
  departPoint: string;
  arrivalPoint: string;
  distanceKm: number;
  numberOfEtagesDepart: number;
    numberOfEtagesArrival: number;

  withElevatorDepart: boolean;
    withElevatorArrival: boolean;
  phone:string;
  umzugdate:Date;
  withDemontage: boolean;
  withMontage: boolean;
  withDemontageLamp: boolean;
  withMontageLamp: boolean;
  withParkPlatzDepart: boolean;
    withParkPlatzArrival: boolean;

  numberOfKartons: number;
  kitchen?: Kitchen;
  rooms: any[];
  totalPrice: number;
  totalVolumeM3: number;
  date?: Date;
}

@Component({
  selector: 'app-add-umzug',
  templateUrl: './add-umzug.component.html',
  styleUrls: ['./add-umzug.component.scss']
})
export class AddUmzugComponent implements OnInit {
  umzugForm!: FormGroup;
  rooms: Room[] = [];
  kitchens: Kitchen[] = [];
  selectedRooms: { [key: number]: boolean } = {};
  mobelsForRooms: { [key: number]: Mobel[] } = {};
  totalPrice: number = 0;
  totalVolume: number = 0;
  loading = false;
  
  // Edit mode variables
  isEditMode = false;
  editingRequestId: number | null = null;
  pageTitle = 'Neue Umzug Anfrage';

  // Price constants
  readonly PRICE_PER_M3 = 35;
  readonly PRICE_PER_KARTON = 2.75;
  readonly PRICE_PER_KM = 2;
  readonly MIN_DISTANCE_FREE = 20;
  readonly ETAGE_PRICE_WITHOUT_ELEVATOR = 50;
  readonly ETAGE_PRICE_WITH_ELEVATOR = 25;
  readonly DEMONTAGE_PRICE = 100;
  readonly MONTAGE_PRICE = 150;
  readonly DEMONTAGELAMP_PRICE = 50;
  readonly MONTAGELAMP_PRICE = 40;
  readonly WITHOUT_PARKPLATZ_PRICE = 70;

  constructor(
    private fb: FormBuilder,
    private umzugService: UmzugService,
    private route: ActivatedRoute,
    private router: Router,
    private sweetAlertService: SweetAlertService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.editingRequestId = +params['id'];
        this.pageTitle = 'Umzug Anfrage bearbeiten';
        this.loadRequestForEdit(this.editingRequestId);
      }
    });

    this.loadRooms();
    this.loadKitchens();
    this.setupFormValueChanges();
  }

  initializeForm(): void {
    this.umzugForm = this.fb.group({
      clientName: ['', [Validators.required]],
      clientEmail: ['', [Validators.required, Validators.email]],
      departPoint: ['', [Validators.required]],
      arrivalPoint: ['', [Validators.required]],
      distanceKm: [0, [Validators.min(0)]],
      numberOfEtagesDepart: [1, [Validators.min(1)]],
            numberOfEtagesArrival: [1, [Validators.min(1)]],

      withElevatorDepart: [false],
            withElevatorArrival: [false],
      phone: ['', [Validators.required, Validators.pattern(/^[+]?([0-9]{10,15})$/)]],  // Pattern to allow + and numbers (10-15 digits)
      umzugdate: ['', [Validators.required]],
            withDemontage: [false],
      withMontage: [false],
      withDemontageLamp: [false],
      withMontageLamp: [false],
      withParkPlatzDepart: [false],
            withParkPlatzArrival: [false],

      numberOfKartons: [0, [Validators.min(0)]],
      kitchen: [null],
      date: []
    });
  }

  loadRequestForEdit(requestId: number): void {
    this.loading = true;
    this.umzugService.getById(requestId).subscribe({
      next: (request: Request) => {
        this.populateFormForEdit(request);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading request for edit:', error);
        this.sweetAlertService.error('Fehler beim Laden der Umzug Anfrage');
        this.router.navigate(['/pages/umzug/list']);
        this.loading = false;
      }
    });
  }

  populateFormForEdit(request: Request): void {
    // Populate basic form fields
     if (this.kitchens.length === 0) {
    // If kitchens aren't loaded yet, wait a bit and try again
    setTimeout(() => this.populateFormForEdit(request), 100);
    return;
  }
     let selectedKitchen = null;
  if (request.kitchen) {

    selectedKitchen = this.kitchens.find(k => k.id_kitchen === request.kitchen!.id_kitchen);
  }
    this.umzugForm.patchValue({
      clientName: request.clientName,
      clientEmail: request.clientEmail,
      departPoint: request.departPoint,
      arrivalPoint: request.arrivalPoint,
      distanceKm: request.distanceKm,
      numberOfEtagesDepart: request.numberOfEtagesDepart,
            numberOfEtagesArrival: request.numberOfEtagesArrival,

      withElevatorDepart: request.withElevatorDepart,
            withElevatorArrival: request.withElevatorArrival,
      phone:request.phone,
      withDemontage: request.withDemontage,
      withMontage: request.withMontage,
      withDemontageLamp: request.withDemontageLamp,
      withMontageLamp: request.withMontageLamp,
      withParkPlatzDepart: request.withParkPlatzDepart,
      withParkPlatzArrival: request.withParkPlatzArrival,

      numberOfKartons: request.numberOfKartons,
      kitchen: selectedKitchen,
      date: request.date
    });
    // Populate rooms and mobels
    if (request.rooms && request.rooms.length > 0) {
      request.rooms.forEach(requestRoom => {
        const roomId = requestRoom.room.id_room;
        
        // Mark room as selected
        this.selectedRooms[roomId] = true;
        
        // Add mobels for this room
        this.mobelsForRooms[roomId] = requestRoom.elements.map((element: any) => ({
          id: element.id_element,
          name: element.name,
          width: element.width,
          height: element.height,
          length: element.length,
                      numberElement: element.numberElement,
          price:element.price,
          q2: element.q2
        }));
      });
    }

    // Recalculate totals
    this.calculateTotalPrice();
  }

  setupFormValueChanges(): void {
    this.umzugForm.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    });
  }

  loadRooms(): void {
    this.loading = true;
    this.umzugService.getAllRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.loading = false;
      }
    });
  }

  loadKitchens(): void {
    this.umzugService.getAllKitchens().subscribe({
      next: (kitchens) => {
        this.kitchens = kitchens;
      },
      error: (error) => {
        console.error('Error loading kitchens:', error);
      }
    });
  }

  toggleRoom(roomId: number): void {
    if (this.selectedRooms[roomId]) {
      // Remove room and all its mobels
      delete this.selectedRooms[roomId];
      delete this.mobelsForRooms[roomId];
    } else {
      // Add room
      this.selectedRooms[roomId] = true;
      this.mobelsForRooms[roomId] = [];
    }
    this.calculateTotalPrice();
  }

  addMobelToRoom(roomId: number): void {
    if (!this.mobelsForRooms[roomId]) {
      this.mobelsForRooms[roomId] = [];
    }
    const room = this.rooms.find(r => r.id_room === roomId);
    if (!room) {
      console.error('Room not found', roomId);
      return;
    }

    const newMobel: Mobel = {
      name: '',
      width: 0,
      numberElement:1,
      height: 0,
      length: 0,
      q2: 0,
      price:0
    };
    
    this.mobelsForRooms[roomId].push(newMobel);
  }
onImageSelect(roomId: number, mobelIndex: number, event: any): void {
  const imageFile = event.target.files[0] as File;
  if (!imageFile) return;

  // Validate file type
  if (!imageFile.type.startsWith('image/')) {
    this.sweetAlertService.error('Bitte wählen Sie nur Bilddateien aus');
    return;
  }

  // Validate file size (max 5MB)
  if (imageFile.size > 5 * 1024 * 1024) {
    this.sweetAlertService.error('Bildgröße darf 5MB nicht überschreiten');
    return;
  }

  const mobel = this.mobelsForRooms[roomId][mobelIndex];
 const reader = new FileReader();
      reader.onload = () => {
           mobel.imageUrl=imageFile

        mobel.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(imageFile);
  // Upload image to the backend and handle response
 
}
  removeMobelFromRoom(roomId: number, mobelIndex: number): void {
    if (this.mobelsForRooms[roomId]) {
      this.mobelsForRooms[roomId].splice(mobelIndex, 1);
      this.calculateTotalPrice();
    }
  }

  updateMobel(roomId: number, mobelIndex: number, field: string, value: any): void {
    if (this.mobelsForRooms[roomId] && this.mobelsForRooms[roomId][mobelIndex]) {
      // Update the mobel object with the new field value
      (this.mobelsForRooms[roomId][mobelIndex] as any)[field] = value;

      // Recalculate volume if dimensions changed
      if (['width', 'height', 'length','numberElement'].includes(field)) {
        const mobel = this.mobelsForRooms[roomId][mobelIndex];
              const anzahl = mobel.numberElement || 1; // Default to 1 if anzahl is not set

        mobel.q2 = ((mobel.width * mobel.height * mobel.length)*anzahl) / 1000000; // Convert cm³ to m³
  const basePricePerUnit = mobel.q2 * this.PRICE_PER_M3;
      
      // Calculate total price including quantity (anzahl)
      console.log(anzahl,"ajn")
      mobel.price = basePricePerUnit * anzahl;    
    console.log(mobel.price,"tet") }
      console.log(this.mobelsForRooms[roomId] && this.mobelsForRooms[roomId][mobelIndex], "mobel updated");

      this.calculateTotalPrice();
    }
  }

  handleInputChange(roomId: number, mobelIndex: number, field: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    // If the field is a numeric value, we parse it to a float
    const parsedValue = field === 'width' || field === 'height' || field === 'length' ? parseFloat(value) || 0 : value;
    
    // Call the updateMobel method with the parsed value
    this.updateMobel(roomId, mobelIndex, field, parsedValue);
  }

  calculateTotalPrice(): void {
    let totalPrice = 0;
    let totalVolume = 0;

    // Calculate total volume from all mobels
    Object.values(this.mobelsForRooms).forEach(mobels => {
      mobels.forEach(mobel => {
        const volume = (mobel.width * mobel.height * mobel.length) / 1000000; // Convert to m³
              const anzahl = mobel.numberElement || 1; // Default to 1 if anzahl is not set

        totalVolume += volume * anzahl;
      });
    });
    
    // Volume price
    totalPrice += totalVolume * this.PRICE_PER_M3;

    // Kartons price
    const kartons = this.umzugForm.get('numberOfKartons')?.value || 0;
    totalPrice += kartons * this.PRICE_PER_KARTON;

    // Distance price
    const distance = this.umzugForm.get('distanceKm')?.value || 0;
    if (distance > this.MIN_DISTANCE_FREE) {
      totalPrice += (distance - this.MIN_DISTANCE_FREE) * this.PRICE_PER_KM;
    }

    // Etage price
    const etagesDepart = this.umzugForm.get('numberOfEtagesDepart')?.value || 1;
    const etagesArrival = this.umzugForm.get('numberOfEtagesArrival')?.value || 1;

    const withElevatorDepart = this.umzugForm.get('withElevatorDepart')?.value || false;
    if (withElevatorDepart) {
      totalPrice += etagesDepart * this.ETAGE_PRICE_WITH_ELEVATOR;
    } else {
      totalPrice += etagesDepart * this.ETAGE_PRICE_WITHOUT_ELEVATOR;
    }
    const withElevatorArrival = this.umzugForm.get('withElevatorArrival')?.value || false;
    if (withElevatorArrival) {
      totalPrice += etagesArrival * this.ETAGE_PRICE_WITH_ELEVATOR;
    } else {
      totalPrice += etagesArrival * this.ETAGE_PRICE_WITHOUT_ELEVATOR;
    }
    
    // Demontage price
    const withDemontage = this.umzugForm.get('withDemontage')?.value || false;
    if (withDemontage) {
      totalPrice += this.DEMONTAGE_PRICE;
    }
    
    const withMontage = this.umzugForm.get('withMontage')?.value || false;
    if (withMontage) {
      totalPrice += this.MONTAGE_PRICE;
    }
    
    const withDemontageLamp = this.umzugForm.get('withDemontageLamp')?.value || false;
    if (withDemontageLamp) {
      totalPrice += this.DEMONTAGELAMP_PRICE;
    }
    
    const withMontageLamp = this.umzugForm.get('withMontageLamp')?.value || false;
    if (withMontageLamp) {
      totalPrice += this.MONTAGELAMP_PRICE;
    }
    
    // Kitchen price
    const kitchen = this.umzugForm.get('kitchen')?.value;
    if (kitchen) {
      totalPrice += kitchen.price;
    }
    
    const parkPlatzDepart = this.umzugForm.get('withParkPlatzDepart')?.value;
    if (!parkPlatzDepart) {
      totalPrice += this.WITHOUT_PARKPLATZ_PRICE;
    }
    const parkPlatzArrival = this.umzugForm.get('withParkPlatzArrival')?.value;
    if (!parkPlatzArrival) {
      totalPrice += this.WITHOUT_PARKPLATZ_PRICE;
    }

    this.totalPrice = totalPrice;
    this.totalVolume = totalVolume;
  }

  getSelectedRoomsList(): Room[] {
    return this.rooms.filter(room => this.selectedRooms[room.id_room]);
  }

  getRoomName(roomId: number): string {
    const room = this.rooms.find(r => r.id_room === roomId);
    return room ? room.name : '';
  }

  onSubmit(): void {
    if (this.umzugForm.valid) {
     const formData = this.umzugForm.value;
           const formDataUmzug = new FormData();


      // Prepare mobels array
       const roomsPayload = Object.entries(this.mobelsForRooms).map(([roomIdStr, mobels]) => {
      const roomId = Number(roomIdStr);
      return {
        room: { id_room: roomId },
        elements: mobels.map(mobel => {
          const elementData: any = {
            id_element: mobel.id,
            name: mobel.name,
            width: mobel.width,
            height: mobel.height,
            length: mobel.length,
            q2: mobel.q2,
            numberElement: mobel.numberElement,
            price: mobel.price,
          };

          // Add the image for the element if available
          if (mobel.imageUrl) {

            formDataUmzug.append('file', mobel.imageUrl);
          }

          return elementData;
        })
      };
    });

      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${('0'+(now.getMonth()+1)).slice(-2)}-${('0'+now.getDate()).slice(-2)} ${('0'+now.getHours()).slice(-2)}:${('0'+now.getMinutes()).slice(-2)}`;
       const umzugdate = new Date(formData.umzugdate);
      const umzugData = {
        ...formData,
        rooms: roomsPayload,
        totalPrice: this.totalPrice,
        totalVolumeM3: this.totalVolume,
        date: this.isEditMode ? formData.date : formattedDate,
        umzugdate :`${umzugdate.getFullYear()}-${('0' + (umzugdate.getMonth() + 1)).slice(-2)}-${('0' + umzugdate.getDate()).slice(-2)} ${('0' + umzugdate.getHours()).slice(-2)}:${('0' + umzugdate.getMinutes()).slice(-2)}`
      };

      // Add ID for edit mode
      if (this.isEditMode && this.editingRequestId) {
        umzugData.id_request = this.editingRequestId;
      }

      this.loading = true;
  formDataUmzug.append('umzugData', JSON.stringify(umzugData));

      // Choose save or update method based on mode
      const saveObservable = this.isEditMode && this.editingRequestId 
        ? this.umzugService.updateUmzug(this.editingRequestId, formDataUmzug)
        : this.umzugService.saveUmzug(formDataUmzug);

      saveObservable.subscribe({
        next: (result) => {
          const message = this.isEditMode 
            ? `Umzug erfolgreich aktualisiert! Gesamtpreis: ${this.totalPrice.toFixed(2)}€`
            : `Umzug erfolgreich gespeichert! Gesamtpreis: ${this.totalPrice.toFixed(2)}€`;
          
          this.sweetAlertService.success(message).then(() => {
            this.router.navigate(['/pages/umzug']);
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error saving umzug:', error);
          const errorMessage = this.isEditMode 
            ? 'Fehler beim Aktualisieren des Umzugs'
            : 'Fehler beim Speichern des Umzugs';
          this.sweetAlertService.error(errorMessage);
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.sweetAlertService.warning('Bitte füllen Sie alle erforderlichen Felder aus.');
    }
  }

  cancel(): void {
    if (this.isEditMode) {
      this.sweetAlertService.confirm(
        'Änderungen verwerfen?',
        'Alle nicht gespeicherten Änderungen gehen verloren.',
        'warning'
      ).then((result: any) => {
        if (result.isConfirmed) {
          this.router.navigate(['/pages/umzug']);
        }
      });
    } else {
      this.router.navigate(['/pages/umzug']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.umzugForm.controls).forEach(key => {
      const control = this.umzugForm.get(key);
      control?.markAsTouched();
    });
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.umzugForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getDistanceExtraPrice(): number {
    const distance = this.umzugForm.get('distanceKm')?.value || 0;
    return distance > this.MIN_DISTANCE_FREE ? (distance - this.MIN_DISTANCE_FREE) * this.PRICE_PER_KM : 0;
  }

  getEtagePriceDepart(): number {
    const etages = this.umzugForm.get('numberOfEtagesDepart')?.value || 1;
    const withElevator = this.umzugForm.get('withElevatorDepart')?.value || false;
    return etages * (withElevator ? this.ETAGE_PRICE_WITH_ELEVATOR : this.ETAGE_PRICE_WITHOUT_ELEVATOR);
  }
 getEtagePriceArrival(): number {
    const etages = this.umzugForm.get('numberOfEtagesArrival')?.value || 1;
    const withElevator = this.umzugForm.get('withElevatorArrival')?.value || false;
    return etages * (withElevator ? this.ETAGE_PRICE_WITH_ELEVATOR : this.ETAGE_PRICE_WITHOUT_ELEVATOR);
  }
  getKartonsPrice(): number {
    const kartons = this.umzugForm.get('numberOfKartons')?.value || 0;
    return kartons * this.PRICE_PER_KARTON;
  }
}