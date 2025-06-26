import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }
  private api_url = 'http://localhost:3000/product';
  private cart_url = 'http://localhost:3000/cart/add';

  getProduct(): Observable<any[]>{
    return this.http.get<[]>(this.api_url).pipe(
      // Something to do with the array properties
      tap((response) => console.log('API Response:', response))
    );
  }

  getProductById(productId: number): Observable<any> {
    return this.http.get<any>(`${this.api_url}/${productId}`).pipe(
      tap((response)  => console.log(`Fetching Product Id : ${productId}`, response))
    );
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.api_url}/delete/${productId}`).pipe(
      tap((response) => console.log(`Deleted Product Id : ${productId}`, response))
    );
  }

  updateProduct(productId: number, productData: any): Observable<any> {
    return this.http.patch(`${this.api_url}/edit-product/${productId}`, productData).pipe(
      tap((response) => console.log(`Updated Product Id : ${productId}`, response))
    );
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file); // 'image' must match the field name in backend

    return this.http.post<{ url: string }>('http://localhost:3000/product/uploads', formData);
  }

  handleFileSelection(
    event: Event,
    callback: (imageUrls: string[]) => void,
    existingImages: string[] = []
  ): void {
    const fileInput = event.target as HTMLInputElement;
    const files = fileInput?.files;

    if (files) {
      const newImageUrls: string[] = [...existingImages];
      Array.from(files).forEach((file) => {
        this.uploadImage(file).subscribe({
          next: (response) => {
            newImageUrls.push(response.url);
            callback(newImageUrls);
          },
          error: (err) => console.error('Upload failed bum:', err),
        });
      });
    }
  }

  addToCart(userId: string, name: string, productId: string, price: number, imageUrls: string[], quantity: number): Observable<any> {
    const body = { userId, name, productId, price, imageUrl: imageUrls[0], quantity};
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(this.cart_url, body, httpOptions).pipe(
      tap((response) => console.log('Cart Added:', response))
    );
  }

  searchQuery(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api_url}/search?query=${query}`).pipe(
      tap((response) => console.log('Search Results:', response))
    );
  }
}
