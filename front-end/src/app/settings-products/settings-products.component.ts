import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth.service';
import {jwtDecode} from 'jwt-decode';
import {SettingsService} from '../settings.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-settings-products',
    imports: [],
    templateUrl: './settings-products.component.html',
    styleUrl: './settings-products.component.scss'
})
export class SettingsProductsComponent implements OnInit {
  constructor(public authService: AuthService, public settingsService: SettingsService, public router: Router) {}
  products: any[] = [];
  userId: string = '';
  isLoading: boolean = true;

  ngOnInit() {
    const token = localStorage.getItem('access_token');
    if (token) {
      if (this.authService.isTokenValid(token)) {
        const decodedToken = jwtDecode(token) as { sub: string; email: string; iat: number; exp: number };
        this.userId = decodedToken.sub;
        console.log(this.userId);
        this.authService.isLoggedIn = true;
      }
    }
    this.loadProducts();
  }

  loadProducts() {
    this.settingsService.seeUserProducts(this.userId).subscribe({
      next: (productsResponse) => {
        this.products = productsResponse;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    })
  }

  viewProductStats(id: number) {
    this.router.navigate([`settings/product/stats/${id}`]);
  }
}
