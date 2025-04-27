import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AnimalService } from '../../services/animal.service';
import { CommonModule } from '@angular/common';
import { Animal } from '../../models/animal';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-animals',
  templateUrl: './animals.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./animals.component.scss']
})
export class AnimalsComponent implements OnInit {
  animals: Animal[] = [];
  favorites: number[] = [];
  isLoggedIn = false;
  private authSub!: Subscription;
  isAdmin = false;
  adminEditModalOpen = false;
  editAnimal!: Animal;
  originalAnimal!: Animal;

  constructor(private authService: AuthService, private animalService: AnimalService, private router: Router) { }

  ngOnInit(): void {
    this.authSub = this.authService.isLoggedIn$.subscribe(isLogged => {
      this.isLoggedIn = isLogged;
    });

    this.loadAnimals();

    this.animalService.getFavorites().subscribe({
      next: (favorites: Animal[]) => {
        this.favorites = favorites.map(f => f.animalId);
      },
      error: (err) => console.error('Failed to load favorites', err)
    });

    this.authService.userRole$.subscribe(role => {
      this.isAdmin = role === 'admin';
    });
  }

  addToFavorites(animalId: number): void {
    this.animalService.addToFavorites(animalId).subscribe({
      next: (response: any) => { }
    });
  }

  handleButtonClick(event: MouseEvent, animal: Animal) {
    event.stopPropagation();

    if (this.isAdmin) {
      this.openAdminModal(animal);
    } else {
      this.toggleFavorite(event, animal);
    }
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

  openAdminModal(animal: Animal) {
    this.editAnimal = { ...animal };
    this.originalAnimal = { ...animal };
    this.adminEditModalOpen = true;
  }

  closeAdminModal() {
    this.adminEditModalOpen = false;
  }

  saveAnimalChanges() {

    const changes: any = {};

    for (const key in this.editAnimal) {
      if (key !== '_id' && key !== 'animalId') { 
        if ((this.editAnimal as any)[key] !== (this.originalAnimal as any)[key]) {
          changes[key] = (this.editAnimal as any)[key];
        }
      }
    }

    if (Object.keys(changes).length === 0) {
      alert('Nincs módosítás.');
      return;
    }

    this.animalService.updateAnimal(this.editAnimal.animalId, changes).subscribe({
      next: () => {
        alert('Állat sikeresen frissítve!');
        this.loadAnimals();
        this.closeAdminModal();
      },
      error: () => {
        alert('Hiba történt az állat frissítése közben.');
      }
    });
  }

  deleteAnimal() {
    if (confirm('Biztosan törölni akarod ezt az állatot?')) {
      this.animalService.deleteAnimal(this.editAnimal.animalId).subscribe({
        next: () => {
          alert('Állat sikeresen törölve!');
          this.loadAnimals();
          this.closeAdminModal();
        },
        error: () => {
          alert('Hiba történt az állat törlése közben.');
        }
      });
    }
  }

  loadAnimals() {
    this.animalService.getAllAnimals().subscribe({
      next: (response: Animal[]) => {
        this.animals = response;
      }
    });
  }

}
