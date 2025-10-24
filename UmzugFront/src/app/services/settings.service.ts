import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Settings} from "../models/Settings";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private url = environment.apiUrl + 'settings'

  constructor(private http: HttpClient) { }

  getSettings() {
    return this.http.get<Settings[]>(this.url);
  }

  getSettingsById(id: number| undefined) {
    return this.http.get<Settings>(this.url + '/' + id);
  }

  addSettings(formData: FormData){
    return this.http.post<Settings>(this.url+`/add`, formData);
  }

  updateSettings(formData: FormData){
    return this.http.put<Settings>(this.url+`/edit`, formData);
  }

  deleteSettings(id: number): Observable<any> {
    return this.http.delete<void>(this.url  + '/' + id);
  }

}
