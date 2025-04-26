import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News } from '../models/news';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private apiUrl = 'http://localhost:5000/api/news';

  constructor(private http: HttpClient) {}

  getAllNews(): Observable<News[]> {
    return this.http.get<News[]>(this.apiUrl);
  }

  getNewsById(newsId: number): Observable<News> {
    return this.http.get<News>(`${this.apiUrl}/${newsId}`);
  }
}
