import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PdfGeneratorService } from 'src/app/services/pdfgenerator.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { UmzugService } from 'src/app/services/umzug.service';

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
  numberElement:number;
  width: number;
  height: number;
  length: number;
  q2: number;
  price:number;
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

export interface CompanyInfo {
  name: string;
  logo: string;
  geschaeftsfuehrer: string;
  email: string;
  telephone: string;
  website: string;
  address: string;
}

@Component({
  selector: 'app-UmzugFormular',
  templateUrl: './UmzugFormular.component.html',
  styleUrls: ['./UmzugFormular.component.scss']
})
export class UmzugFormularComponent implements OnInit {
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

  // Quote generator variables
  showQuote = false;
  currentRequestData: Request | null = null;
  companyInfo: CompanyInfo = {
    name: 'Sam24 GmbH',
    logo: 'data:image/png;base64,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', 
    geschaeftsfuehrer: 'Walid Saidi',
    email: 'info@sam24gmbh.de',
    telephone: '+49 176 64637070',
    website: 'www.sam24gmbh.de',
    address: 'SophienStrasse 44 Frankfurt am Main 60487'
  };

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
    private sweetAlertService: SweetAlertService,
    private pdfGeneratorService: PdfGeneratorService // Add this injection
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
      phone: ['', [Validators.required, Validators.pattern(/^[+]?([0-9]{10,15})$/)]],
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
      phone: request.phone,
      withDemontage: request.withDemontage,
      withMontage: request.withMontage,
      withDemontageLamp: request.withDemontageLamp,
      withMontageLamp: request.withMontageLamp,
      withParkPlatzDepart: request.withParkPlatzDepart,
      withParkPlatzArrival: request.withParkPlatzArrival,
      numberOfKartons: request.numberOfKartons,
      kitchen: request.kitchen,
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
      price: 0
    };
    
    this.mobelsForRooms[roomId].push(newMobel);
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
      mobel.price = basePricePerUnit * anzahl;    
    console.log(mobel.price,"tet") 
        console.log(mobel.q2,"ajn")
}
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

  // Method to generate and show quote
  generateQuote(): void {
    if (this.umzugForm.valid) {
      const formData = this.umzugForm.value;
      
      // Prepare mobels array
      const roomsPayload = Object.entries(this.mobelsForRooms).map(([roomIdStr, mobels]) => {
        const roomId = Number(roomIdStr);
        return {
          room: { id_room: roomId },
          elements: mobels.map(m => ({
            id_element: m.id,
            name: m.name,
            width: m.width,
            height: m.height,
            length: m.length,
            q2: m.q2,
            price: m.price
          }))
        };
      });

      const umzugdate = new Date(formData.umzugdate);
      
      this.currentRequestData = {
        ...formData,
        rooms: roomsPayload,
        totalPrice: this.totalPrice,
        totalVolumeM3: this.totalVolume,
        umzugdate: `${umzugdate.getFullYear()}-${('0' + (umzugdate.getMonth() + 1)).slice(-2)}-${('0' + umzugdate.getDate()).slice(-2)} ${('0' + umzugdate.getHours()).slice(-2)}:${('0' + umzugdate.getMinutes()).slice(-2)}`
      };

      this.showQuote = true;
    } else {
      this.markFormGroupTouched();
      this.sweetAlertService.warning('Bitte füllen Sie alle erforderlichen Felder aus.');
    }
  }

  onSubmit(): void {
    if (this.umzugForm.valid) {
      const formData = this.umzugForm.value;
      
      // Prepare mobels array
      const roomsPayload = Object.entries(this.mobelsForRooms).map(([roomIdStr, mobels]) => {
        const roomId = Number(roomIdStr);
        
        return {
          room: { id_room: roomId }, // minimal; backend will attach managed Room
          elements: mobels.map(m => {
      console.log('q2 value for element', m.name, ':', m.q2); // <-- log q2 here
      return {
        id_element: m.id, // Include ID for existing elements in edit mode
        name: m.name,
        width: m.width,
        height: m.height,
        length: m.length,
        q2: m.q2,
        numberElement: m.numberElement,
        price: m.price,
      };
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
        umzugdate: `${umzugdate.getFullYear()}-${('0' + (umzugdate.getMonth() + 1)).slice(-2)}-${('0' + umzugdate.getDate()).slice(-2)} ${('0' + umzugdate.getHours()).slice(-2)}:${('0' + umzugdate.getMinutes()).slice(-2)}`
      };

      // Add ID for edit mode
      if (this.isEditMode && this.editingRequestId) {
        umzugData.id_request = this.editingRequestId;
      }

      this.loading = true;

      // Choose save or update method based on mode
      const saveObservable = this.isEditMode && this.editingRequestId 
        ? this.umzugService.updateUmzug(this.editingRequestId, umzugData)
        : this.umzugService.saveUmzug(umzugData);

      saveObservable.subscribe({
        next: async (result) => {
          const message = this.isEditMode 
            ? `Umzug erfolgreich aktualisiert! Gesamtpreis: ${this.totalPrice.toFixed(2)}€`
            : `Umzug erfolgreich gespeichert! Gesamtpreis: ${this.totalPrice.toFixed(2)}€`;
          
          // Show success message
          await this.sweetAlertService.success(message);
          
          // Automatically generate and download PDF
          try {
            await this.pdfGeneratorService.generateQuotePDF(umzugData, this.companyInfo, this.rooms);
            
            // Show additional success message for PDF
            this.sweetAlertService.success('PDF wurde erfolgreich heruntergeladen!');
            
          } catch (error) {
            console.error('Error generating PDF:', error);
            
            // If PDF generation fails, offer alternative options
            const fallbackResult = await this.sweetAlertService.confirm(
              'PDF-Generation fehlgeschlagen',
              'Das PDF konnte nicht automatisch erstellt werden. Möchten Sie das Angebot in einem neuen Fenster anzeigen?',
              'warning'
            );
            
            if (fallbackResult.isConfirmed) {
              this.currentRequestData = umzugData;
              this.showQuote = true;
            }
          }
          
          this.loading = false;
        },
        error: (error) => {
          console.error('Error saving umzug:', error);
          const errorMessage = this.isEditMode 
            ? 'Fehler beim Aktualisieren des Umzugs'
            : 'Fehler beim Speichern des Umzugs';
          this.sweetAlertService.error(errorMessage);
        error: (error:any) => {
          console.error('Error saving umzug:', error);
          const errorMessage = this.isEditMode 
            ? 'Fehler beim Aktualisieren des Umzugs'
            : 'Fehler beim Speichern des Umzugs';
          this.sweetAlertService.error(errorMessage);
          this.loading = false;
        }
      }});
    } else {
      this.markFormGroupTouched();
      this.sweetAlertService.warning('Bitte füllen Sie alle erforderlichen Felder aus.');
    }
  }

  // Add a new method to manually download PDF without saving
  async downloadPDF(): Promise<void> {
    if (this.umzugForm.valid) {
      const formData = this.umzugForm.value;
      
      // Prepare the data for PDF generation
      const roomsPayload = Object.entries(this.mobelsForRooms).map(([roomIdStr, mobels]) => {
        const roomId = Number(roomIdStr);
        return {
          room: { id_room: roomId },
          elements: mobels.map(m => ({
            name: m.name,
            width: m.width,
            height: m.height,
            length: m.length,
            q2: m.q2,
            price: m.price
          }))
        };
      });

      const umzugdate = new Date(formData.umzugdate);
      
      const pdfData = {
        ...formData,
        rooms: roomsPayload,
        totalPrice: this.totalPrice,
        totalVolumeM3: this.totalVolume,
        umzugdate: `${umzugdate.getFullYear()}-${('0' + (umzugdate.getMonth() + 1)).slice(-2)}-${('0' + umzugdate.getDate()).slice(-2)} ${('0' + umzugdate.getHours()).slice(-2)}:${('0' + umzugdate.getMinutes()).slice(-2)}`
      };

      try {
        await this.pdfGeneratorService.generateQuotePDF(pdfData, this.companyInfo, this.rooms);
        this.sweetAlertService.success('PDF wurde erfolgreich heruntergeladen!');
      } catch (error) {
        console.error('Error generating PDF:', error);
        this.sweetAlertService.error('Fehler beim Erstellen des PDFs. Bitte versuchen Sie es erneut.');
      }
    } else {
      this.markFormGroupTouched();
      this.sweetAlertService.warning('Bitte füllen Sie alle erforderlichen Felder aus, bevor Sie das PDF erstellen.');
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

  // Close quote method
  closeQuote(): void {
    this.showQuote = false;
  }

  // Send quote by email method
  sendByEmail(): void {
    if (this.currentRequestData) {
      const subject = `Umzugsangebot für ${this.currentRequestData.clientName}`;
      const body = `Sehr geehrte/r ${this.currentRequestData.clientName},

anbei erhalten Sie unser Angebot für Ihren Umzug am ${new Date(this.currentRequestData.umzugdate).toLocaleDateString('de-DE')}.

Umzugsdetails:
- Von: ${this.currentRequestData.departPoint}
- Nach: ${this.currentRequestData.arrivalPoint}
- Entfernung: ${this.currentRequestData.distanceKm} km
- Gesamtvolumen: ${this.currentRequestData.totalVolumeM3?.toFixed(2)} m³

Gesamtpreis (netto): ${this.currentRequestData.totalPrice?.toFixed(2)} €
Gesamtpreis (brutto): ${(this.currentRequestData.totalPrice * 1.19)?.toFixed(2)} €

Bei Fragen stehen wir Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
${this.companyInfo.geschaeftsfuehrer}
${this.companyInfo.name}

Telefon: ${this.companyInfo.telephone}
E-Mail: ${this.companyInfo.email}
Website: ${this.companyInfo.website}`;

      const mailtoLink = `mailto:${this.currentRequestData.clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink);
    }
  }

  // Method to update company information (can be called from settings)
  updateCompanyInfo(newInfo: Partial<CompanyInfo>): void {
    this.companyInfo = { ...this.companyInfo, ...newInfo };
  }

  // Helper methods for template
  getCurrentDate(): string {
    return new Date().toLocaleDateString('de-DE');
  }

  getQuoteNumber(): string {
    const now = new Date();
    return `ANB-${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
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
  formatDate(dateString: Date): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
  }

  formatDatetime(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('de-DE');
  }
}