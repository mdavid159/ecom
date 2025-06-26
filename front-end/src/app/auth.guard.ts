import { Injectable } from "@angular/core";
import {CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class authGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('accessToken');

    if (token) {
      return true; // Allow access
    } else {
      this.router.navigate(['/auth/login']); // Redirect to login page
      return false; // Block access
    }
  }
}
