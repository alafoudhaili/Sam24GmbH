import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LargeElement } from "../models/LargeElement";

@Injectable({
  providedIn: 'root'
})
export class LargeElementService {
  private url = environment.apiUrl + 'largeElement';

  constructor(private http: HttpClient) { }

  getAll(): Observable<LargeElement[]> {
    return this.http.get<LargeElement[]>(this.url);
  }

  getById(id: number): Observable<LargeElement> {
    return this.http.get<LargeElement>(`${this.url}/${id}`);
  }

  addLargeElement(largeElement: LargeElement): Observable<LargeElement> {
    return this.http.post<LargeElement>(`${this.url}/add`, largeElement);
  }

  updateLargeElement(id: number, largeElement: LargeElement): Observable<LargeElement> {
    return this.http.put<LargeElement>(`${this.url}/edit/${id}`, largeElement);
  }

  deleteLargeElement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }
}