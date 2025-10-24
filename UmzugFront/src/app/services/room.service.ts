import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";
import { Room } from '../models/Room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private baseUrl = environment.apiUrl + 'room';

  constructor(private http: HttpClient) {}

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.baseUrl}`);
  }

  addRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(`${this.baseUrl}/add`, room);
  }

  updateRoom(room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.baseUrl}/edit`, room);
  }
  deleteRoom(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
  }


}
