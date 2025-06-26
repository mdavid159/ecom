import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
    selector: 'app-change-password',
    imports: [
        FormsModule,
        NgClass
    ],
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  constructor(public authService: AuthService, private router: Router, private route : ActivatedRoute) {}

  passwordData = {userId: '', token: '', newPassword: '' };

  ngOnInit(): void {
    this.passwordData.userId = this.route.snapshot.paramMap.get('id') || '';
  }

  onChangePassword(): void {
    if (this.passwordData.token &&  this.passwordData.newPassword) {
      this.authService.changePassword(this.passwordData.userId, this.passwordData.token, this.passwordData.newPassword).subscribe({
          next: (response) => {
            console.log('Password changed:', response);
            alert('Password changed successfully.');
            this.router.navigate(['main']);
        },
        error: (error) => {
          console.error('Verification failed:', error);
          alert('Verification failed. Please check your token.');
        },
        });
    } else {
      alert('Please enter a new password and token');
    }
  }
}
