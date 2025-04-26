import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animal } from '../models/animal';

@Injectable({ providedIn: 'root' })
export class AnimalService {
  private apiUrl = 'http://localhost:5000/api/animals';
  private favUrl = 'http://localhost:5000/api/user';

  constructor(private http: HttpClient) {}

  createAnimal(animal: Animal): Observable<any> {
    return this.http.post<Animal>(`${this.apiUrl}/create`, animal, { withCredentials: true });
  }

  getAllAnimals(): Observable<any[]> {
    return this.http.get<Animal[]>(`${this.apiUrl}`);
  }

  getAnimalById(animalId: number): Observable<any> {
    return this.http.get<Animal>(`${this.apiUrl}/${animalId}`);
  }

  updateAnimal(animalId: number, updatedData: any): Observable<any> {
    return this.http.put<Animal>(`${this.apiUrl}/update/${animalId}`, updatedData, { withCredentials: true });
  }

  deleteAnimal(animalId: number): Observable<any> {
    return this.http.delete<Animal>(`${this.apiUrl}/${animalId}`, { withCredentials: true });
  }

  addToFavorites(animalId: number): Observable<any> {
    return this.http.post(`${this.favUrl}/favorites/${animalId}`, {}, { withCredentials: true });
  }

  getFavorites(): Observable<any> {
    return this.http.get<Animal[]>(`${this.favUrl}/favorites`, { withCredentials: true });
  }

  removeFavorite(animalId: number): Observable<any> {
    return this.http.delete(`${this.favUrl}/favorites/${animalId}`, { withCredentials: true });
  }
}
