import { Injectable } from '@angular/core';
import {User} from "../models/User";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  private url = environment.apiUrl + 'profil'
  constructor(private http: HttpClient) { }

  updateUserWithPhoto(formData: FormData){
    return this.http.put<User>(this.url+`/photo`, formData);
  }

  updateUserWithoutPhoto(user:FormData){
    return this.http.put<User>(this.url + '/edit',user)
  }
}
