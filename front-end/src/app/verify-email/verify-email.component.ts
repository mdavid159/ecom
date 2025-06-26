import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'app-verify-email',
    templateUrl: './verify-email.component.html',
    styleUrls: ['./verify-email.component.scss'],
    imports: [
        FormsModule
    ]
})
export class VerifyEmailComponent implements OnInit {
  verifyData = { userID: '', token: '' };

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Extract user ID from the route
    this.verifyData.userID = this.route.snapshot.paramMap.get('id') || '';
  }

  verify() {
    if (this.verifyData.token) {
      this.authService.verifyEmail(this.verifyData.userID, this.verifyData.token).subscribe({
        next: (response) => {
          console.log('User verified:', response);
          alert('Email verified successfully. Please log in.');
          this.router.navigate(['auth/login']);
        },
        error: (error) => {
          console.error('Verification failed:', error);
          alert('Verification failed. Please check your token.');
        },
      });
    } else {
      alert('Please enter the token.');
    }
  }
}
