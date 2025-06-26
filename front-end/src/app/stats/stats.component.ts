import {Component, OnInit} from '@angular/core';
import {jwtDecode} from 'jwt-decode';
import {AuthService} from '../auth.service';
import {SettingsService} from '../settings.service';
import {ProductService} from '../product.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-stats',
    imports: [],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
  constructor(public route: ActivatedRoute, public authService: AuthService, public settingsService: SettingsService, public productService: ProductService) {}

  product: any = null;

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    console.log(productId);

    this.settingsService.seeStats(productId).subscribe({
      next: (productResponse) => {
        console.log('Product response:', productResponse);
        this.product = productResponse;

        const token = localStorage.getItem('access_token');
        if (token) {
          try {
            if (this.authService.isTokenValid(token)) {
              this.authService.isLoggedIn = true;
              const decodedToken = jwtDecode(token) as {
                sub: string;
                email: string;
                iat: number;
                exp: number;
              };
            }
          } catch (error) {
            console.error('Error decoding token:', error);
          }
        }
      },
      error: (error) => {
        console.error('Error fetching product details:', error);
      }
    });
  }
}
