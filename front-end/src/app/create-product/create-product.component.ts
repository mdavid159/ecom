import {Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import {jwtDecode} from 'jwt-decode';
import {ProductService} from '../product.service';

@Component({
    selector: 'app-create-product',
    imports: [FormsModule],
    templateUrl: './create-product.component.html',
    styleUrl: './create-product.component.scss'
})
export class CreateProductComponent implements OnInit {
  constructor(private authService: AuthService, private productService: ProductService) {}

  ngOnInit() {
    const token = localStorage.getItem('access_token');
    if (token) {
      if(this.authService.isTokenValid(token)) {
        this.authService.isLoggedIn = true;
      }
    }
  }

  hoveredIndex: number | null = null;

  product = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    imageUrl: [] as string[],
  };

  onFileSelected(event: Event): void {
    this.productService.handleFileSelection(event, (updatedImageUrls) => {
      this.product.imageUrl = updatedImageUrls;
      console.log('Image URLs:', this.product.imageUrl);
    }, this.product.imageUrl);
  }

  onCreate() {
    const { name, description, price, stock, category, imageUrl } = this.product;
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.warn('User is not authenticated. No token found.');
      return;
    }

    try {
      const decodedToken = jwtDecode(token) as {
        sub: string;
        email: string;
        iat: number;
        exp: number;
      };

      const userMail = decodedToken.email;

      const productData = {
        name: this.product.name,
        description: this.product.description,
        price: Number(this.product.price),
        stock: Number(this.product.stock),
        category: this.product.category,
        ByUser: userMail,
        imageUrl: this.product.imageUrl,
      };

      console.log("Product data:", productData);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price.toString());
      formData.append('stock', stock.toString());
      formData.append('category', category);
      formData.append('ByUser', userMail);

      imageUrl.forEach((file) => {
        formData.append('images', file);
      });

      console.log("Form data: ", formData);

      this.authService.createProduct(productData).subscribe({
        next: (response) => {
          alert('Product created successfully');
          console.log('Response:', response);
        },
        error: (err) => {
          console.error('Error creating product:', err);
        },
      });
    } catch (err) {
      console.error('Error decoding token:', err);
    }
  }

  removeImage(index: number) {
    this.product.imageUrl.splice(index, 1);
  }

  protected readonly document = document;
}
