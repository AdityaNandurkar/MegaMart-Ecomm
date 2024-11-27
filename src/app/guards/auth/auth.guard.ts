import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api/api.service';
import { NotificationService } from 'src/app/service/notify/notification.service';

export const authGuard: CanActivateFn = (route, state) => {
  const apiService = inject(ApiService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  if (apiService.isLoggedIn()) {
    return true;
  }
  else {
    notificationService.showInfo("Login first");
    router.navigate(['loginRegister']);
    return false;
  }
};
