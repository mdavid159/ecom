import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userName: string = '';
  public userId: string = '';
  public isLoggedIn: boolean = false;
  public isAuthenticated: boolean = true;
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  get loggedIn(): boolean {
    return this.isLoggedIn;
  }

  logIn(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/auth/login`;
    const body = { email, password };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(url, body, httpOptions);
  }

  register(name: string, email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/auth/register`;
    const body = { name, email, password };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(url, body, httpOptions);
  }

  verifyEmail(userID: string, token: string): Observable<any> {
    const url = `${this.apiUrl}/auth/verify-email/${userID}`;
    const body = { token };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(url, body, httpOptions);
  }

  forgotPassword(email: string): Observable<any> {
    const url = `${this.apiUrl}/auth/forgot-password`;
    const body = { email };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(url, body, httpOptions);
  }

  changePassword(userID: string, token: string, newPassword: string): Observable<any> {
    const url = `${this.apiUrl}/auth/change-password/${userID}`;
    const body = { token, newPassword };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(url, body, httpOptions);
  }

  getUserIdByEmail(email: string): Observable<any> {
    const url = `${this.apiUrl}/user/id-by-email`;
    const body = { email };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post<{ userId: string }>(url, body, httpOptions);
  }

  getNameByEmail(email: string): Observable<any> {
    const url = `${this.apiUrl}/user/name-by-email`;
    const body = { email };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(url, body, httpOptions);
  }

  logOut(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('access_token');
    localStorage.removeItem('isAuthenticated');
  }

  isTokenValid(token: string): boolean {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp >= currentTime) {
      return true;
    } else {
      localStorage.removeItem('access_token');
      localStorage.removeItem('isAuthenticated');
      return false;
    }
  }

  /*createProduct(productData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/product/create`, productData);
  }*/

  createProduct(product: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    ByUser: string;
    imageUrl: string[];
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/product/create`, product).pipe(
      tap((response) => console.log(`Created Product: ${response}`))
    );
  }
}
