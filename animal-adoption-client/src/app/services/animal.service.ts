import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animal } from '../models/animal';

@Injectable({ providedIn: 'root' })
export class AnimalService {
  private apiUrl = '/api/animals';
  private favUrl = '/api/user';

  constructor(private http: HttpClient) {}

  createAnimal(animal: Animal, imageFiles?: File[]): Observable<any> {
    const form = new FormData();
    form.append('name', animal.name);
    form.append('species', animal.species);
    form.append('breed', animal.breed);
    form.append('age', animal.age.toString());
    form.append('description', animal.description);
    form.append('temperament', animal.temperament);
    form.append('healthInfo', animal.healthInfo);
    form.append('available', animal.available ? 'true' : 'false');
    if (imageFiles) {
      // The first file becomes the cover/thumbnail; order is preserved.
      for (const file of imageFiles) {
        form.append('images', file);
      }
    }

    return this.http.post<Animal>(`${this.apiUrl}/create`, form, { withCredentials: true });
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
    return this.http.delete<Animal>(`${this.apiUrl}/${animalId}`, { withCredentials: true , responseType: 'text' as 'json'});
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
