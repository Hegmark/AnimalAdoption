import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }


  login(email: string, password: string) {
    // HTTP POST request
    const body = new URLSearchParams();
    body.set('email', email);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('http://localhost:5000/api/user/login', body, {headers: headers, withCredentials: true});
  }

  checkAuth() {
    // HTTP GET request
    const body = new URLSearchParams();

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.get('http://localhost:5000/api/user/checkAuth', {headers: headers, withCredentials: true});
  }
}
