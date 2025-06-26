import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {HeaderComponent} from './header/header.component';
import {AuthService} from './auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent{}
