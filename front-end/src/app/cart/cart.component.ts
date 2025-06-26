import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {loadStripe} from '@stripe/stripe-js';

@Component({
    selector: 'app-cart',
    imports: [],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private http: HttpClient,
  ) {}

  cartItems: any[] = [];
  public userId: string = '';
  public totalPrice: number = 0;
  public totalQuantity: number = 0;

  ngOnInit() {
    const token = localStorage.getItem('access_token');

    if (token) {
      if (this.authService.isTokenValid(token)) {
        const decodedToken = jwtDecode(token) as {
          sub: string;
          email: string;
          iat: number;
          exp: number;
        };
        this.userId = decodedToken.sub;
        console.log('Showing cart items for user:', this.userId);
        console.log('Logged in user:', decodedToken.email);

        this.authService.getNameByEmail(decodedToken.email).subscribe({
          next: (userNameResponse) => {
            this.authService.userName = userNameResponse.name;
            console.log('Logged in user:', this.authService.userName);
          },
          error: (err) => {
            console.error('Error fetching user name:', err);
          },
        });
        this.authService.isLoggedIn = true;

        this.loadCartItems();
        this.getTotalItems();
        this.getTotalPrice();
      }
    }
  }

  loadCartItems() {
    this.cartService.seeCart(this.userId).subscribe({
      next: (cartItems) => {
        this.cartItems = cartItems.map((item: any) => ({
          ...item,
          imageUrl: item.imageUrl,
        }));
        console.log('Cart items loaded:', this.cartItems);
        console.log('Image url:', this.cartItems[0].imageUrl);
      },
      error: (error) => {
        console.error('Error fetching cart items:', error);
      },
    });
  }

  updateQuantity(productId: number, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const newQuantity = inputElement.valueAsNumber;

    if (isNaN(newQuantity) || newQuantity <= 0) {
      console.error('Invalid quantity');
      return;
    }

    const item = this.cartItems.find((item) => item.productId === productId);
    if (!item) return;

    const oldQuantity = item.quantity;
    item.quantity = newQuantity;

    this.totalQuantity += newQuantity - oldQuantity;
    this.totalPrice += (newQuantity - oldQuantity) * item.price;

    this.cartService.updateQuantity(this.userId, productId, newQuantity).subscribe({
      next: (response) => {
        console.log('Quantity updated:', response);
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
        item.quantity = oldQuantity;
        this.totalQuantity -= newQuantity - oldQuantity;
        this.totalPrice -= (newQuantity - oldQuantity) * item.price;
      },
    });
  }

  removeFromCart(cartItemId: number) {
    this.cartService.deleteProductFromCart(cartItemId).subscribe({
      next: (response) => {
        console.log('Product removed from cart:', response);
        this.loadCartItems();
        location.reload();
      },
      error: (error) => {
        console.error('Error removing product from cart:', error);
      },
    });
  }

  getTotalItems() {
    this.cartService.getTotalItemsInCart(this.userId).subscribe({
      next: (totalItems) => {
        console.log('Total items in cart:', totalItems);
        this.totalQuantity = totalItems;
        this.loadCartItems();
      },
      error: (error) => {
        console.error('Error fetching total items:', error);
      },
    });
  }

  getTotalPrice() {
    this.cartService.getTotalPriceInCart(this.userId).subscribe({
      next: (totalPrice) => {
        console.log('Total price in cart:', totalPrice);
        this.totalPrice = totalPrice;
        this.loadCartItems();
      },
      error: (error) => {
        console.error('Error fetching total price:', error);
      },
    });
  }

  checkout() {
    this.http.post('http://localhost:4242/checkout', {
      items: this.cartItems
    }).subscribe( async(res: any) => {
      let stripe = await loadStripe('pk_test_51Qg9q7FRSCuMVdLxIEy88PZGyWWC6MDjdYG2cAQfXkDRFCsyxw5ez7VH5qSW5dU4SPvv3hYpsF790Qgo2Hae5yd900AUnbwTVg');
      stripe?.redirectToCheckout({
        sessionId: res.id
      });
    });
  }

  goToItem(productId: number) {
    this.router.navigate([`/product/${productId}`]);
  }
}
