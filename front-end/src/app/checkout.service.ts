import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  api_url = 'http://localhost:3000/checkout'

  constructor(private http: HttpClient) { }

  sendEmail(userId: string, recipientEmail: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('recipientEmail', recipientEmail)

    return this.http.get<any>(`${this.api_url}/success`, { params });
  }

  deleteCart(id: string): Observable<any> {
    return this.http.delete<any>(`${this.api_url}/delete/${id}`);
  }
}
