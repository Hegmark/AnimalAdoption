import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdoptionRequest } from '../models/adoption-request';

@Injectable({ providedIn: 'root' })
export class AdoptionRequestService {
  private apiUrl = 'http://localhost:5000/api/adoption';

  constructor(private http: HttpClient) {}

  getMyRequests(): Observable<AdoptionRequest[]> {
    return this.http.get<AdoptionRequest[]>(`${this.apiUrl}/my-requests`, {withCredentials: true});
  }
}
