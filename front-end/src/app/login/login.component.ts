import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth.service';
import { NgClass } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
    selector: 'app-login',
    imports: [FormsModule, RouterOutlet, NgClass, RouterLink, RouterLinkActive],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginData = { email: '', password: '' };

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    if (this.loginData.email && this.loginData.password) {
      this.authService.logIn(this.loginData.email, this.loginData.password).subscribe({
        next: (response) => {
          const accessToken = response.access_token;
          localStorage.setItem('access_token', accessToken);
          console.log('Access token:', accessToken);
          console.log(jwtDecode(accessToken));

          this.authService.getNameByEmail(this.loginData.email).subscribe({
            next: (userNameResponse) => {
              this.authService.userName = userNameResponse.name;
              console.log('User name:', this.authService.userName);
            },
          });

          this.authService.getUserIdByEmail(this.loginData.email).subscribe({
            next: (userIdResponse) => {
              this.authService.userId = userIdResponse.userId;
              console.log('User ID fetched:', this.authService.userId);
            },
            error: (error) => {
              console.error('Error fetching user ID:', error);
            }
          })

          localStorage.setItem('IsAuthenticated', String(this.authService.isAuthenticated));
          console.log('IsAuthenticated:', this.authService.isAuthenticated);
          this.authService.isLoggedIn = true;
          this.router.navigate(['main']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          alert('Login failed. Please check your credentials and try again.');
        },
      });
    } else {
      alert('Please enter both email and password.');
    }
  }
}
