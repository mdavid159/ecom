import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient) { }
  public api_url = 'http://localhost:3000/settings';

  changeName(id: string, newName: string, password: string): Observable<any> {
    const url = `${this.api_url}/change-name/${id}`;
    const body = { id, newName, password };
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(url, body, httpOptions).pipe(
      tap((response) => console.log('Cart Added:', response))
    );
  }

  seeUserProducts(id: string): Observable<any> {
    return this.http.get<any>(`${this.api_url}/products/${id}`).pipe(
      tap((response) => console.log('User Products:', response))
    );
  }

  seeStats(id: number): Observable<any> {
    return this.http.get<any>(`${this.api_url}/products/stats/${id}`).pipe(
      tap((response) => console.log('Stats:', response))
    );
  }
}
