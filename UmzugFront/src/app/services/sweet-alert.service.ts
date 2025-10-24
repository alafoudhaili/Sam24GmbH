import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {
  confirm(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question'): Promise<any> {
    return Swal.fire({
      title,
      text,
      icon,  // Now it only accepts the defined icon types
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      return result;  // Returns the result as a Promise
    });
  }
  info(arg0: string) {
    throw new Error('Method not implemented.');
  }
  confirmDelete() {
    throw new Error('Method not implemented.');
  }


  constructor() { }

  warning(msg: string) {
    return Swal.fire({
      icon: 'warning',
      html: msg,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      reverseButtons: false,
      text:msg,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-primary'
      },
    });
  }

  danger(msg: string) {
    return Swal.fire({
      icon: 'error',
      text: msg,
      title: 'Warning',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: true,
      focusConfirm: false,
      reverseButtons: false,
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-danger'
      },
    });
  }

  notification(msg: string) {
    return Swal.fire({
      icon: 'warning',
      text: msg,
      showCloseButton: false,
      showCancelButton: true,
      showConfirmButton: false,
      focusCancel: false,
      cancelButtonText: 'OK',
      timer: 7000
    });
  }

  success(msg: string) {
    return Swal.fire({
      icon: 'success',
      html: msg,
      showCloseButton: false,
      showCancelButton: true,
      showConfirmButton: false,
      focusCancel: true,
      reverseButtons: false,
      customClass: {
        cancelButton: 'btn btn-success'
      },
      cancelButtonText: 'OK',
      timer: 4000
    });
  }

  error(msg: string) {
    return Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: msg,
      showCloseButton: true,
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-danger',
      },
    });
  }

}

