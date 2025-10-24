import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Element } from "../models/Element";

@Injectable({
  providedIn: 'root'
})
export class ElementService {
  private baseUrl = environment.apiUrl + 'element';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Element[]> {
    return this.http.get<Element[]>(this.baseUrl);
  }

  getById(id: number): Observable<Element> {
    return this.http.get<Element>(`${this.baseUrl}/${id}`);
  }

  save(element: Element): Observable<Element> {
    return this.http.post<Element>(`${this.baseUrl}/add`, element);
  }

  update(element: Element): Observable<Element> {
    return this.http.put<Element>(`${this.baseUrl}/edit`, element);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}