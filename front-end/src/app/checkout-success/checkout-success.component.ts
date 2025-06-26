import { Component, OnInit } from '@angular/core';
import {CheckoutService} from '../checkout.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {jwtDecode} from 'jwt-decode';

@Component({
    selector: 'app-checkout-success',
    imports: [],
    templateUrl: './checkout-success.component.html',
    styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccessComponent implements OnInit {
  constructor(public checkoutService: CheckoutService, public router: Router, public authService: AuthService, private route: ActivatedRoute) {}

  async ngOnInit() {
    const token = localStorage.getItem('access_token');
    if (token) {
      if (this.authService.isTokenValid(token)) {
        const decodedToken = jwtDecode(token) as { sub: string; email: string; iat: number; exp: number };
        const { email, sub: userId } = decodedToken;
        console.log('Logged in user:', email);
        console.log('Id of user logged:', userId);

        this.authService.getNameByEmail(email).subscribe({
          next: (userNameResponse) => {
            this.authService.userName = userNameResponse.name;
            console.log('Logged in user:', this.authService.userName);
          },
          error: (err) => {
            console.error('Error fetching user name:', err);
          }
         });

        try {
          await this.checkoutEmail(userId, email);
          await this.deleteCartItems(userId);
        } catch (err) {
          console.log('Error during checkout process:', err);
        }
        this.authService.isLoggedIn = true;
      }
    }
  }

  checkoutEmail(userId: string, recipientEmail: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.checkoutService.sendEmail(userId, recipientEmail).subscribe({
        next: (response) => {
          console.log('Checkout email response:', response);
          resolve();
        },
        error: (error) => {
          console.error('Error sending email:', error);
        }
      });
    });
  }

  deleteCartItems(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.checkoutService.deleteCart(id).subscribe({
        next: (response) => {
          console.log('Cart items deleted:', response);
          resolve();
        },
        error: (error) => {
          console.error('Error deleting cart items:', error);
        }
      });
    });
  }

  navigateToHome() {
    this.router.navigate(['main']);
  }
}

