import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private newsUrl = 'http://localhost:5000/api/news';

  constructor(private http: HttpClient) {}

  createNews(newsData: { title: string; content: string }): Observable<any> {
    return this.http.post(`${this.newsUrl}/create`, newsData, { withCredentials: true });
  }
}
