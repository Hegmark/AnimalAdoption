import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdoptionRequest, AdoptionRequestPopulated } from '../models/adoption-request';

@Injectable({ providedIn: 'root' })
export class AdoptionRequestService {
  private apiUrl = 'http://localhost:5000/api/adoption';

  constructor(private http: HttpClient) {}

  getMyRequests(): Observable<AdoptionRequest[]> {
    return this.http.get<AdoptionRequest[]>(`${this.apiUrl}/my-requests`, {withCredentials: true});
  }

  createAdoptionRequest(requestData: { animalId: number; message: string; adoptionDate: string; }): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, requestData, { withCredentials: true });
  }

  getAllRequests(): Observable<AdoptionRequestPopulated[]> {
    return this.http.get<AdoptionRequestPopulated[]>(`${this.apiUrl}/`, { withCredentials: true });
  }

  updateRequest(adReId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${adReId}`, { status }, { withCredentials: true });
  }

  deleteRequest(adReId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${adReId}`, { withCredentials: true });
  }
}
