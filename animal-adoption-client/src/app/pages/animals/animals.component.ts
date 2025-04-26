import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AnimalService } from '../../services/animal.service';
import { CommonModule } from '@angular/common';
import { Animal } from '../../models/animal';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-animals',
  templateUrl: './animals.component.html',
  imports: [CommonModule],
  styleUrls: ['./animals.component.scss']
})
export class AnimalsComponent implements OnInit {
  animals: Animal[] = [];
  favorites: number[] = [];
  isLoggedIn = false;
  private authSub!: Subscription;

  constructor(private authService: AuthService, private animalService: AnimalService, private router: Router) { }

  ngOnInit(): void {
    this.authSub = this.authService.isLoggedIn$.subscribe(isLogged => {
      this.isLoggedIn = isLogged;
    });

    this.animalService.getAllAnimals().subscribe({
      next: (response: Animal[]) => {
        this.animals = response;
      }
    });

    this.animalService.getFavorites().subscribe({
      next: (favorites: Animal[]) => {
        this.favorites = favorites.map(f => f.animalId);
      },
      error: (err) => console.error('Failed to load favorites', err)
    });
  }

  addToFavorites(animalId: number): void {
    this.animalService.addToFavorites(animalId).subscribe({
      next: (response: any) => { }
    });
  }

  isFavorite(animal: Animal): boolean {
    return this.favorites.includes(animal.animalId);
  }

  goToAnimal(animalId: number) {
    this.router.navigate(['/animals', animalId]);
  }

  toggleFavorite(event: Event, animal: Animal) {
    event.stopPropagation();

    if (this.isFavorite(animal)) {
      this.animalService.removeFavorite(animal.animalId).subscribe({
        next: () => {
          this.favorites = this.favorites.filter(id => id !== animal.animalId);
        },
        error: (err) => console.error('Failed to remove favorite', err)
      });
    } else {
      this.animalService.addToFavorites(animal.animalId).subscribe({
        next: () => {
          this.favorites.push(animal.animalId);
        },
        error: (err) => console.error('Failed to add favorite', err)
      });
    }
  }
}
