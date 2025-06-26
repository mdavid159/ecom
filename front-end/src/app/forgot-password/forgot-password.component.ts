import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
    selector: 'app-forgot-password',
    imports: [
        RouterLink,
        RouterLinkActive,
        FormsModule
    ],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  constructor(private authService: AuthService, private router: Router) { }
  forgotPasswordData = { email: '' };
  onForgotPassword() {
    this.authService.forgotPassword(this.forgotPasswordData.email).subscribe({
      next:(response) => {
        console.log('Email sent',response);

        this.authService.getUserIdByEmail(this.forgotPasswordData.email).subscribe({
          next:(UserIdResponse) => {
            const userId = UserIdResponse.userId;
            console.log('User ID fetched:', userId);
            this.router.navigate([`/change-password/${userId}`]);
          },
          error: (error) => {
            console.error('Error fetching user ID:', error);
            alert('Could not fetch user ID. Please try again.');
          },
        });
      },
        error: (error) => {
          console.error('Registration failed:', error);
          alert('Registration failed. Please try again.');
        },
    });
  }
}
