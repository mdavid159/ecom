import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { AuthService } from '../auth.service';
import {NgClass} from '@angular/common';

@Component({
    selector: 'app-register',
    imports: [FormsModule, RouterOutlet, NgClass, RouterLink, RouterLinkActive],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerData = { email: '', password: '', name: '' };
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.loading = true;
    this.authService.register(this.registerData.name, this.registerData.email, this.registerData.password).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);

        // Fetch the user ID after registration
        this.authService.getUserIdByEmail(this.registerData.email).subscribe({
          next: (userIdResponse) => {
            const userId = userIdResponse.userId;
            console.log('User ID fetched:', userId);

            // Navigate to the verify-email route with the user ID
            this.router.navigate([`/verify-email/${userId}`]);
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
