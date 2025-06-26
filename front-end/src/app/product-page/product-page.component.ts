import {Component, NgModule, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {ProductService} from '../product.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import {SlideInterface} from '../ProductSlider/Types/slide.interface';
import {ProductSliderModule} from '../ProductSlider/productSlider.module';

@Component({
    selector: 'app-product-page',
    imports: [ProductSliderModule],
    templateUrl: './product-page.component.html',
    styleUrl: './product-page.component.scss'
})
export class ProductPageComponent implements OnInit {
  constructor(public authService: AuthService, public productService: ProductService, public route: ActivatedRoute, public router: Router) {}

  product: any = {};
  isOwner: boolean = false;
  userId: string = '';
  quantity: number = 1;
  slides: SlideInterface[] = [];

  ngOnInit() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    this.productService.getProductById(productId).subscribe({
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
              const userMail = decodedToken.email;
              this.userId = decodedToken.sub;
              this.isOwner = userMail === this.product.ByUser;
            }
          } catch (error) {
            console.error('Error decoding token:', error);
          }
        }

        this.slides = this.product.imageUrl.map((slide: string) => ({
          url: `http://localhost:3000${slide}`,
        }));
        console.log("Slides:", this.slides);

        if (productResponse.ByUser) {
          this.authService.getNameByEmail(this.product.ByUser).subscribe({
            next: (userName) => {
              this.product.ByUser = userName.name;
              console.log('User name:', userName.name);
              console.log("Array length:", this.product.imageUrl.length);
            },
            error: (err) => {
              console.error('Error fetching user name:', err);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error fetching product details:', error);
      }
    });
  }

  onDelete(productId: number){
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
       alert('Product deleted!');
       this.router.navigate(['/main']);
      },
      error: (error) => {
        console.error('Error deleting product:', error);
      }
    })
  }

  onEdit(productId: number) {
   this.router.navigate([`/edit-product/${productId}`]);
  }

  addToCart(userId: string, name: string, productId: string, price: number, imageUrl: string[], quantity: number) {
    const reqPayload = { userId, name, productId, price, imageUrl, quantity };
    console.log('Request:', JSON.stringify(reqPayload, null, 2));
    console.log(userId);
    console.log(quantity);
    this.productService.addToCart(userId, name, productId, price, imageUrl, quantity).subscribe({
      next: (response) => {
        alert('Product added to cart!');
        console.log('Add to cart response:', response);
        console.log('image url:', imageUrl[0]);
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
      }
    });
  }
}
