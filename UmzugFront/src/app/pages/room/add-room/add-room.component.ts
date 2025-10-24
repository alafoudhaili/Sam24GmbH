import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { RoomService } from 'src/app/services/room.service';
import { ElementService } from 'src/app/services/element.service';
import { Element } from '../../../models/Element';
import { Room } from '../../../models/Room';
@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss']
})
export class AddRoomComponent implements OnInit {
  breadCrumbItems = [
    { label: 'Raum' },
    { label: 'hinzufügen', active: true }
  ];

  addRoomForm!: FormGroup;
  allElements: Element[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private roomService: RoomService,
    private elementService: ElementService,

    private swal: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.addRoomForm = this.fb.group({
      name: ['', Validators.required],
    });

  
  }

  get f() { return this.addRoomForm.controls; }

  
  onSubmit() {
    if (this.addRoomForm.invalid) {
      this.swal.danger('Bitte Namen  auswählen.');
      return;
    }

    const room: Room = {
      name: this.f['name'].value,
    };

    this.roomService.addRoom(room).subscribe(
      () => {
        this.swal.success('Raum erfolgreich hinzugefügt!');
        this.router.navigate(['/pages/room']);
      },
      () => this.swal.danger('Fehler beim Anlegen des Raums.')
    );
  }

  cancel() {
    this.router.navigate(['/pages/room']);
  }
}
