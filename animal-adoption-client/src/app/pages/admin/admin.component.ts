import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { News } from '../../models/news';
import { Animal } from '../../models/animal';
import { AnimalService } from '../../services/animal.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  news: News = {
    title: '', content: '',
  };

  animal: Animal = {
    name: '',
    species: '',
    breed: '',
    age: 0,
    description: '',
    temperament: '',
    healthInfo: '',
    available: true,
    animalId: 0
  }


  constructor(private adminService: AdminService, private router: Router, private animalService: AnimalService) {}

  createNews() {
    if (!this.news.title || !this.news.content) {
      alert('Minden mezőt ki kell tölteni!');
      return;
    }

    this.adminService.createNews({
      title: this.news.title,
      content: this.news.content
    }).subscribe({
      next: () => {
        alert('Hírek sikeresen létrehozva!');
      },
      error: (err) => {
        console.error('Failed to create news', err);
        alert('Hiba történt a hírek létrehozása közben.');
      }
    });
  }

  createAnimal() {
    if (!this.animal.name || !this.animal.species || !this.animal.breed || !this.animal.age || !this.animal.description || !this.animal.temperament || !this.animal.healthInfo) {
      alert('Kérlek töltsd ki az összes állat mezőt!');
      return;
    }

    this.animalService.createAnimal(this.animal).subscribe({
      next: () => {
        alert('Állat sikeresen létrehozva!');
        this.clearAnimalForm();
      },
      error: () => alert('Hiba történt az állat létrehozása során.')
    });
  }

  clearAnimalForm() {
    this.animal.name = '';
    this.animal.species = '';
    this.animal.breed = '';
    this.animal.age = 0;
    this.animal.description = '';
    this.animal.temperament = '';
    this.animal.healthInfo = '';
    this.animal.available = true;
  }
}
