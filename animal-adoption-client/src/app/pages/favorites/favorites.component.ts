import { Component, OnInit } from '@angular/core';
import { Animal } from '../../models/animal';
import { Router } from '@angular/router';
import { AnimalService } from '../../services/animal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  imports: [CommonModule],
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favorites: Animal[] = [];

  constructor(
    private router: Router,
    private animalService: AnimalService,
  ) { }

  ngOnInit(): void {
    this.animalService.getFavorites().subscribe({
      next: (data) => this.favorites = data,
      error: (err) => console.error('Failed to load favorites', err)
    });
  }

  isFavorite(animal: Animal): boolean {
    return this.favorites.includes(animal);
  }

  goToAnimal(animalId: number) {
    this.router.navigate(['/animals', animalId]);
  }

  toggleFavorite(event: Event, animal: Animal) {
    event.stopPropagation();

    this.animalService.removeFavorite(animal.animalId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(a => a.animalId !== animal.animalId);
      },
      error: (err) => console.error('Failed to remove favorite', err)
    });
  }
}
