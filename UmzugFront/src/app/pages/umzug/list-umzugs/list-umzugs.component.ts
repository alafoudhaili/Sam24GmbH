// list-umzugs.component.ts
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UmzugService } from 'src/app/services/umzug.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service'; // New service to handle user operations
import { User } from 'src/app/models/User';

export interface RequestRoom {
  id?: number;
  room: any;
  elements: Element[];
}

export interface Element {
  id_element?: number;
  name: string;
  width: number;
  height: number;
  length: number;
  q2: number;
  re?: number;
  price: number;
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
  kitchen?: any;
  rooms: any[];
  totalPrice: number;
  totalVolumeM3: number;
  date?: Date;
}

@Component({
  selector: 'app-list-umzugs',
  templateUrl: './list-umzugs.component.html',
  styleUrls: ['./list-umzugs.component.scss']
})
export class ListUmzugsComponent implements OnInit {

  breadCrumbItems: Array<{}> = [];
  listUmzugs: Request[] = [];
  originalListUmzugs: Request[] = [];
  selectedUmzug: Request | null = null;
  users: User[] = []; // Users list to be populated
  selectedUserIds: Set<number> = new Set(); // Set to track selected user IDs

  currentPage = 1;
  itemsPerPage = 10;
  length = 0;
  loading = false;

  modalRef: any;
  isCollapsed: boolean[] = [];

  constructor(
      private umzugService: UmzugService,
      private modalService: NgbModal,
      private sweetAlertService: SweetAlertService,
      private router: Router,
          private userService: UserService, // Inject the UserService

  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Umzug' },
      { label: 'List', active: true }
    ];

    this.loadUmzugs();
  }
  toggleCollapse(roomIndex: number) {
    this.isCollapsed[roomIndex] = !this.isCollapsed[roomIndex];
  }
  loadUmzugs() {
    this.loading = true;
    this.umzugService.getAll(this.currentPage - 1, this.itemsPerPage).subscribe(
        (data: any) => {
          this.originalListUmzugs = data.content;
          this.listUmzugs = [...this.originalListUmzugs];
          this.length = data.totalElements;
          this.loading = false;
        },
        error => {
          console.error('Error loading umzugs', error);
          this.sweetAlertService.error('Error loading umzugs');
          this.loading = false;
        }
    );
  }
 openAssignUserModal(umzug: Request,content: TemplateRef<any>) {
    this.selectedUmzug = umzug;

    // Fetch users for assigning
    this.userService.getMitarbeiters().subscribe(
      (data: User[]) => {
        this.users = data; // Populate the user list
        this.modalRef = this.modalService.open(content, { 
          size: 'lg', 
          backdrop: 'static', 
          keyboard: false 
        });
      },
      error => {
        console.error('Error loading users', error);
        this.sweetAlertService.error('Error loading users');
      }
    );
  }

  // Toggle the selection of a user
  toggleUserSelection(userId: number) {
    if (this.selectedUserIds.has(userId)) {
      this.selectedUserIds.delete(userId);
    } else {
      this.selectedUserIds.add(userId);
    }
  }

  // Handle the assignment of selected users to the current Umzug
  assignUsersToUmzug() {
    if (this.selectedUserIds.size === 0) {
      this.sweetAlertService.error('Bitte wählen Sie mindestens einen Benutzer aus.');
      return;
    }

    // Send the selected users to the backend
    this.umzugService.assignUsersToUmzug(this.selectedUmzug?.id_request!, Array.from(this.selectedUserIds)).subscribe(
      response => {
        this.sweetAlertService.success('Benutzer erfolgreich zugewiesen!');
        this.modalRef.close(); // Close the modal
        this.selectedUserIds.clear()
        this.loadUmzugs(); // Refresh the list of umzugs
      },
      error => {
        console.error('Error assigning users', error);
        this.sweetAlertService.error('Fehler beim Zuweisen der Benutzer');
      }
    );
  }

 

  pageChanged(event: any): void {
    this.currentPage = event;
    this.loadUmzugs();
  }

  addUmzug() {
    this.router.navigate(['/pages/umzug/add']);
  }

  viewDetails(umzug: Request, content: TemplateRef<any>) {
    this.loading = true;
    this.umzugService.getById(umzug.id_request!).subscribe(
      (data: Request) => {
        this.selectedUmzug = data;
        this.loading = false;
        this.modalRef = this.modalService.open(content, { 
          size: 'xl',
          backdrop: 'static',
          keyboard: false
        });
      },
      error => {
        console.error('Error loading umzug details', error);
        this.sweetAlertService.error('Error loading umzug details');
        this.loading = false;
      }
    );
  }

  editUmzug(umzug: Request) {
    this.router.navigate(['/pages/umzug/add', umzug.id_request]);
  }

deleteUmzug(umzug: Request): void {
  // Assuming confirm returns a Promise-like object
  this.sweetAlertService.confirm(
    'Sind Sie sicher?',
    `Möchten Sie den Umzug von ${umzug.clientName} wirklich löschen?`,
    'warning'
  ).then((result: any) => { // Explicitly typing result to avoid TS7006 error
    if (result.isConfirmed) {
      this.umzugService.delete(umzug.id_request!).subscribe(
        () => {
          this.sweetAlertService.success('Umzug erfolgreich gelöscht');
          this.loadUmzugs();
        },
        error => {
          console.error('Error deleting umzug', error);
          this.sweetAlertService.error('Fehler beim Löschen des Umzugs');
        }
      );
    }
  }).catch((error) => {
    console.error('Error handling confirmation:', error);
  });
}

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
      this.selectedUmzug = null;
    }
  }

  getTotalElements(): number {
    if (!this.selectedUmzug?.rooms) return 0;
    return this.selectedUmzug.rooms.reduce((total, room) => 
      total + (room.elements?.length || 0), 0
    );
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('de-DE');
  }

  getStatusBadge(umzug: Request): string {
    if (umzug.totalPrice > 1000) {
      return 'bg-warning text-dark';
    } else if (umzug.totalPrice > 500) {
      return 'bg-info';
    } else {
      return 'bg-success';
    }
  }

  exportToPdf(umzug: Request) {
    // Implement PDF export functionality
    console.log('Export to PDF:', umzug);
    this.sweetAlertService.info('PDF Export wird implementiert...');
  }
}