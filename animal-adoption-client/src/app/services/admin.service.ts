import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminMeeting } from '../models/meetings';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  createNews(newsData: { title: string; content: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/news/create`, newsData, { withCredentials: true });
  }

  getUpcomingMeetings(): Observable<AdminMeeting[]> {
    return this.http.get<AdminMeeting[]>(`${this.baseUrl}/user/meetings-all`, {
      withCredentials: true
    });
  }
}
