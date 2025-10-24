import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {User} from "../models/User";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = environment.apiUrl + 'user'

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<User[]>(this.url);
  }

  getUserById(id: number| undefined) {
    return this.http.get<User>(this.url + '/' + id);
  }

  addUser(formData: FormData){
    return this.http.post<User>(this.url+`/add`, formData);
  }

  updateUser(formData: FormData){
    return this.http.put<User>(this.url+`/edit`, formData);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<void>(this.url  + '/' + id);
  }

  getUserByEmail(email: string) {
    return this.http.get<User>(this.url  + '/byEmail/' + email );
  }

  activerCompte(user: User){
    return this.http.put<User>(this.url+`/active`, user);
  }

  desactiverCompte(user: User){
    return this.http.put<User>(this.url+`/inactive`, user);
  }

  getAdmins(): Observable<User[]> {
    return this.http.get<User[]>(this.url + '/admins');
  }

  getMitarbeiters(): Observable<User[]> {
    return this.http.get<User[]>(this.url + '/mitarbeiter');
  }





}

