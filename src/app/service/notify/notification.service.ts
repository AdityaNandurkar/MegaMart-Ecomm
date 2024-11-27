import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }
  showSuccess(msg: string, title: string = 'Success') {
    this.toastr.success(msg, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
    });
  }

  showError(msg: string, title: string = 'Error') {
    this.toastr.error(msg, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
    });
  }

  showWarning(msg: string, title: string = 'Warning') {
    this.toastr.warning(msg, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
    });
  }

  showInfo(msg: string, title: string = 'Info') {
    this.toastr.info(msg, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
    });
  }
}
