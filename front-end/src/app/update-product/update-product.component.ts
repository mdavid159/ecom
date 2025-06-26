import {Component, OnInit} from '@angular/core';
import {ProductService} from '../product.service';
import {AuthService} from '../auth.service';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-update-product',
    imports: [
        FormsModule
    ],
    templateUrl: './update-product.component.html',
    styleUrl: './update-product.component.scss'
})
export class UpdateProductComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  product = {
    id: 0,
    name: '',
    price: 0,
    description: '',
    imageUrl: [] as string[],
    category: '',
    stock: 0,
  }

  ngOnInit(){
    const token = localStorage.getItem('access_token');
    if (token) {
      if(this.authService.isTokenValid(token)) {
        this.authService.isLoggedIn = true;
      }
    }

    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (productId) {
      this.productService.getProductById(productId).subscribe({
        next: (productResponse) => {
          this.product = { ...productResponse };
        },
        error: (error) => {
          console.error('Error fetching product details:', error);
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    this.productService.handleFileSelection(event, (updatedImageUrls) => {
      this.product.imageUrl = updatedImageUrls;
      console.log('Image URLs:', this.product.imageUrl);
    }, this.product.imageUrl);
  }

  onUpdateProduct() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.updateProduct(productId, this.product).subscribe({
      next: (response) => {
          alert(response.message);
          this.router.navigate(['/main']);
      },
      error: (err) => {
        console.error('Error updating product:', err);
      },
    });
  }

  cancelUpdate() {
    this.router.navigate([`/product/${this.product.id}`]);
  }

  protected readonly document = document;
}
