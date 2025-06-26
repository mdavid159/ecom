import {Component, OnInit} from '@angular/core';
import {jwtDecode} from 'jwt-decode';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-settings',
    imports: [],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  constructor(public authService: AuthService, public router: Router) {}
  public userId: string = '';
  public userEmail: string = '';
  ngOnInit() {
    const token = localStorage.getItem('access_token');

    if (token) {
      if (this.authService.isTokenValid(token)) {
        const decodedToken = jwtDecode(token) as { sub: string; email: string; iat: number; exp: number };
        const { email, sub } = decodedToken;
        this.userId = sub;
        this.userEmail = email;
        console.log('Logged in user:', this.userEmail);

        this.authService.getNameByEmail(email).subscribe({
          next: (userNameResponse) => {
            this.authService.userName = userNameResponse.name;
            console.log('Logged in user:', this.authService.userName);
          },
          error: (err) => {
            console.error('Error fetching user name:', err);
          }
        });
        this.authService.isLoggedIn = true;
      }
    }
  }

  resetPassword() {
    this.authService.forgotPassword(this.userEmail).subscribe({
      next:(response) => {
        console.log('Email sent',response);

        this.authService.getUserIdByEmail(this.userEmail).subscribe({
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

  changeName() {
    this.router.navigate([`settings/change-name/${this.userId}`]);
  }

  seeProducts() {
    this.router.navigate([`settings/products/${this.userId}`]);
  }

  logout(): void {
    this.authService.logOut();
    this.router.navigate(['main']);
  }
}
