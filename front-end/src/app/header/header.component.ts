import {Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AuthService} from '../auth.service';
import {jwtDecode} from 'jwt-decode';
import {FormsModule} from '@angular/forms';
import {ProductService} from '../product.service';

@Component({
    selector: 'app-header',
    imports: [RouterLink, RouterOutlet, RouterLinkActive, FormsModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private router: Router, public authService: AuthService, public productService: ProductService) { }
  public searchQuery: string = '';
  public hovered: boolean = false;

  login(): void {
    this.router.navigate(['auth/login']);
  }

  register(): void {
    this.router.navigate(['auth/register']);
  }

  createProd(): void {
    this.router.navigate(['product/create']);
  }

  seeCart(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      if (this.authService.isTokenValid(token)) {
        const decodedToken = jwtDecode(token) as { sub: string; email: string; iat: number; exp: number };
        const { sub } = decodedToken;
        console.log('Showing the cart for user id:', sub);
        this.router.navigate([`cart/${sub}`]);
      }
    }
  }

  seeSettings() {
    this.router.navigate(['settings']);
  }
}
