import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MessageLanding} from "../models/MessageLanding";

@Injectable({
  providedIn: 'root'
})
export class MessageLandingService {


  private url= environment.apiUrl + 'messageLanding';

  constructor(private http: HttpClient) { }

  getAllMessages(): Observable<MessageLanding[]> {
    return this.http.get<MessageLanding[]>(this.url);
  }

  getMessageById(id: number): Observable<MessageLanding> {
    return this.http.get<MessageLanding>(`${this.url}/${id}`);
  }

  addMessage(message: MessageLanding): Observable<MessageLanding> {
    return this.http.post<MessageLanding>(this.url + '/add', message);
  }

  deleteMessage(id: number): Observable<any> {
    return this.http.delete(`${this.url}/delete/${id}`);
  }

  resetAllUnreadLandings(): Observable<any> {
    return this.http.put(`${this.url}/reset-unread-landings`, {});
  }

  getTotalUnreadLandings(): Observable<number> {
    return this.http.get<number>(`${this.url}/total-unread-landings`);
  }

  updateStatut(id: number): Observable<MessageLanding> {
    return this.http.put<MessageLanding>(`${this.url}/${id}/statut`, null);
  }
}

