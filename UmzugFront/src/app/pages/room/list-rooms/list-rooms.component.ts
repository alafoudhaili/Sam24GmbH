import { Component, OnInit } from '@angular/core';
import { Room } from '../../../models/Room';
import { RoomService } from '../../../services/room.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Element } from '../../../models/Element';
import { ElementService } from 'src/app/services/element.service';
@Component({
  selector: 'app-list-rooms',
  templateUrl: './list-rooms.component.html',
  styleUrls: ['./list-rooms.component.scss']
})
export class ListRoomsComponent implements OnInit {
  breadCrumbItems = [
    { label: 'Räume' },
    { label: 'Liste', active: true }
  ];
  rooms: Room[] = [];
  allElements: Element[] = [];

  selectedRoom?: Room;
  deleteModalRef: any;
  editModalRef: any;

  editRoomForm!: FormGroup;
  submitted = false;

  constructor(
    private roomService: RoomService,
    private swal: SweetAlertService,
    private modalService: NgbModal,
    private router: Router,
    private elementService: ElementService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadRooms();

    this.editRoomForm = this.fb.group({
      id_room: [{ value: null, disabled: true }],
      name: ['', Validators.required],
    });
  }

  loadRooms() {
    this.roomService.getRooms().subscribe(
      data => this.rooms = data,
      () => this.swal.danger('Fehler beim Laden der Räume')
    );
  }


 
  addRoom() {
    this.router.navigate(['/pages/room/add']);
  }

  confirmDelete(modal: any, room: Room) {
    this.selectedRoom = room;
    this.deleteModalRef = this.modalService.open(modal, { centered: true });
  }

  deleteRoom() {
    if (!this.selectedRoom) return;
  
    this.roomService.deleteRoom(this.selectedRoom.id_room!).subscribe(
      () => {
        this.swal.success('Raum gelöscht');
        this.rooms = this.rooms.filter(r => r.id_room !== this.selectedRoom!.id_room);
        this.deleteModalRef.close();
      },
      () => this.swal.danger('Fehler beim Löschen')
    );
  }

  openEditModal(modal: any, room: Room) {
    this.selectedRoom = room;
    // Reset form
    this.editRoomForm.reset({
      id_room: room.id_room,
      name: room.name,
    });
    this.submitted = false;
    this.editModalRef = this.modalService.open(modal, { size: 'md', centered: true });
  }

  saveRoom() {
    this.submitted = true;
  

    const updated: Room = {
      id_room: this.selectedRoom!.id_room,
      name: this.editRoomForm.get('name')!.value,
    };
    this.roomService.updateRoom(updated).subscribe(
      () => {
        this.swal.success('Raum erfolgreich aktualisiert!');
        this.editModalRef.close();
        this.loadRooms();
      },
      () => this.swal.danger('Fehler beim Aktualisieren')
    );
  }

  

}