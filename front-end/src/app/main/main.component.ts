import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { jwtDecode } from 'jwt-decode';
import {Router, RouterOutlet} from '@angular/router';
import { ProductService } from '../product.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'app-main',
    imports: [
        RouterOutlet,
        ReactiveFormsModule,
        FormsModule
    ],
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public productService: ProductService,
    public router: Router ) {}

  products: any[] = [];
  filteredProducts: any[] = [];
  searchQuery: string = '';
  isLoading: boolean = true;

  ngOnInit(): void {
    this.loadProducts();
    const token = localStorage.getItem('access_token');

    if (token) {
      if (this.authService.isTokenValid(token)) {
        const decodedToken = jwtDecode(token) as { sub: string; email: string; iat: number; exp: number };
        const { email } = decodedToken;
        console.log('Logged in user:', email);

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

  loadProducts() {
    this.productService.getProduct().subscribe({
      next: (productsResponse) => {
        this.products = productsResponse;
        this.filteredProducts = productsResponse;
        this.isLoading = false;
        this.products.forEach((product) => {
          const email = product.ByUser;
          this.authService.getNameByEmail(email).subscribe({
            next: (userNameResponse) => {
              product.ByUser = userNameResponse.name;
              },
            error: (err) => {
              console.error('Error fetching user name:', err);},
            });
          });
          console.log('Products fetched:', this.products);
          },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    })
  };

  viewProductDetails(productId: number){
    this.router.navigate([`/product/${productId}`]);
  }

  trackByProductId(index: number, product: any): number {
    return product.id;
  }

  onSearch() {
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  fakeTimeout() {
    setTimeout(() => { this.isLoading = true }, 2000);
  }
}
