import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Kitchen} from "../models/Kitchen";
@Injectable({
  providedIn: 'root'
})
export class KitchenService {
  private url = environment.apiUrl + 'kitchen'

  constructor(private http: HttpClient) { }

   getKitchens() {
      return this.http.get<Kitchen[]>(this.url);
    }
  addKitchens(kitchen: Kitchen){
      return this.http.post<Kitchen>(this.url+`/add`, kitchen);
    }
  
    updateKitchen(kitchen: Kitchen) {
      return this.http.put<Kitchen>(`${this.url}/edit/${kitchen.id_kitchen}`, kitchen);
    }

    deleteKitchen(id: number): Observable<any> {
      return this.http.delete<void>(this.url  + '/' + id);
    }
}
