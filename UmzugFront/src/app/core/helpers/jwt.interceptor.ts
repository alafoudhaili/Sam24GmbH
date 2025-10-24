import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor, HttpErrorResponse,
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { AuthenticationService } from '../services/auth.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {catchError} from "rxjs/operators";
import {SweetAlertService} from "../../services/sweet-alert.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    excludeUrls = ['.*/auth', '^$'];
    constructor(
        private authenticationService: AuthenticationService,
        private sweetAlertService : SweetAlertService,
        private router:Router) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (this.isValidRequestForInterceptor(request.url)) {
            const currentUser = this.authenticationService.currentUserValue;

            if (currentUser && currentUser.token) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                });
            }
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    console.log("error")
                    this.sweetAlertService.danger("Votre session est expirée!! Veuillez vous reconnecter ");
                    this.router.navigate(['/auth/login']);
                }
                return throwError(error);
            })
        );
    }


    private isValidRequestForInterceptor(requestUrl: string): boolean {
        const positionIndicator = 'api/';
        const position = requestUrl.indexOf(positionIndicator);
        if (position > 0) {
            for (const address of this.excludeUrls) {
                if (new RegExp(address).test(requestUrl)) {
                    return false;
                }
            }
        }
        return true;
    }


}
