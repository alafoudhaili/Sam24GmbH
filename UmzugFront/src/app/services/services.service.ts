import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Services} from "../models/Services";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private url = environment.apiUrl + 'services'

  constructor(private http: HttpClient) { }

  getServices() {
    return this.http.get<Services[]>(this.url);
  }

  getServicesById(id: number| undefined) {
    return this.http.get<Services>(this.url + '/' + id);
  }

  addServices(services: Services){
    return this.http.post<Services>(this.url+`/add`, services);
  }

  updateServices(services: Services){
    return this.http.put<Services>(this.url+`/edit`, services);
  }

  deleteServices(id: number): Observable<any> {
    return this.http.delete<void>(this.url  + '/' + id);
  }

}

