import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000/cart';

  constructor(private http: HttpClient) {}

  seeCart(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`).pipe(
      tap((response) => console.log('Cart:', response))
    );
  }

  deleteProductFromCart(cartItemId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${cartItemId}`).pipe(
      tap((response) => console.log('Deleted product from cart:', response))
    );
  }

  updateQuantity(
    userId: string,
    productId: number,
    quantity: number
  ): Observable<any> {
    const body = { userId, productId, quantity };
    const endpoint = `${this.apiUrl}/quantity`;
    return this.http.patch(endpoint, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }).pipe(
      tap((response) => console.log(`Quantity response:`, response))
    );
  }

  getTotalItemsInCart(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/total-items/${userId}`).pipe(
      tap((response) => console.log('Total items in cart:', response))
    );
  }

  getTotalPriceInCart(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/total-price/${userId}`).pipe(
      tap((response) => console.log('Total price in cart:', response))
    );
  }
}
