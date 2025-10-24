import { Injectable } from '@angular/core';
import { getFirebaseBackend } from '../../authUtils';
import { User } from '../models/auth.models';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { GlobalComponent } from "../../global-component";
import {environment} from "../../../environments/environment";

const AUTH_API = GlobalComponent.AUTH_API;

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  

@Injectable({ providedIn: 'root' })

export class AuthenticationService {

    user!: User;
    private Url = environment.apiUrl + 'auth';
    private currentUserSubject: BehaviorSubject<any>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')!));
    }
    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    register(formData: FormData) {
        return this.http.post<User>(this.Url + "/register", formData)
            .pipe
            (
                map(
                    user => {
                        return user;
                    }
                )
            )
    }

    registerCareer(formData: FormData) {
        return this.http.post<User>(this.Url + "/registerCareer", formData)
            .pipe
            (
                map(
                    user => {
                        return user;
                    }
                )
            )
    }

    login(email: string, password: string) {
        return this.http.post(this.Url + '/login', {

            email,
            password
        }, httpOptions).pipe
        (
            map(
                user => {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    return user;
                }
            )
        )
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null!);
    }

    verify(email: string, code: string) {
        const params = new HttpParams().set('email', email).set('confirmationCode', code);
        return this.http.post<any>(this.Url + '/confirm-register', null, { params })
            .pipe(
                map(user => {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    return user;
                })
            );
    }

    verifyCareer(email: string, code: string) {
        const params = new HttpParams().set('email', email).set('confirmationCode', code);
        return this.http.post<any>(this.Url + '/confirm-register-career', null, { params })
            .pipe(
                map(user => {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    return user;
                })
            );
    }

    resetPassword(token: string, password: string) {
        let params = new HttpParams();

        params = params.append('token', token);
        params =params.append('newPassword', password);

        return this.http
            .post<any>(`${environment.apiUrl}forgetPassword/resetPassword`, {}, {params: params})
    }

    sendResetPasswordRequest(email: string) {
        const formData = new FormData();
        formData.append('email', email);
        return this.http.post<any>(`${environment.apiUrl}forgetPassword`, formData)
    }
}

