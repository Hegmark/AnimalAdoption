import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) { }


  login(email: string, password: string) {
    const body = new URLSearchParams();
    body.set('email', email);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('http://localhost:5000/api/user/login', body, { headers, withCredentials: true }).pipe(
      tap(() => this.loggedIn.next(true))
    );
  }

  register(username: string, email: string, password: string) {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('email', email);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('http://localhost:5000/api/user/register', body, {headers: headers, withCredentials: true});
  }

  checkAuth() {
    return this.http.get<any>('http://localhost:5000/api/user/checkAuth', { withCredentials: true }).pipe(
      tap(res => this.loggedIn.next(res.authenticated))
    );
  }

  logout() {
    return this.http.post('http://localhost:5000/api/user/logout', {}, { withCredentials: true, responseType: 'text' as 'json'}).pipe(
      tap(() => this.loggedIn.next(false))
    );
  }
}
