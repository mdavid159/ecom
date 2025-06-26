import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {SettingsService} from '../settings.service';
import {NgClass} from '@angular/common';
import {AuthService} from '../auth.service';

@Component({
    selector: 'app-change-name',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        RouterLinkActive,
        NgClass
    ],
    templateUrl: './change-name.component.html',
    styleUrl: './change-name.component.scss'
})
export class ChangeNameComponent implements OnInit{
  constructor(public router: Router, public route: ActivatedRoute, public settingsService: SettingsService, public authService: AuthService) {}

  changeNameData = { userId:'', newName: '', password: '' };

  ngOnInit(): void {
    this.changeNameData.userId = this.route.snapshot.paramMap.get('id') || '';
    const token = localStorage.getItem('access_token');
    if (token) {
      if(this.authService.isTokenValid(token)) {
        this.authService.isLoggedIn = true;
      }
    }
  }

  changeUserName(): void {
    this.settingsService.changeName(this.changeNameData.userId, this.changeNameData.newName, this.changeNameData.password).subscribe({
      next: (response) => {
        console.log('User name updated successfully', response);
        this.router.navigate(['/settings']);
      },
      error: (error) => {
        console.error('Error updating user name:', error);
        alert('Wrong password!');
      }
    });
  }
}
