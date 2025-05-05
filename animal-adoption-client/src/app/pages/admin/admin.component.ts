import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { News } from '../../models/news';
import { Animal } from '../../models/animal';
import { AnimalService } from '../../services/animal.service';
import { AdoptionRequest, AdoptionRequestPopulated } from '../../models/adoption-request';
import { AdoptionRequestService } from '../../services/adoption-requests.service';
import { AdminMeeting } from '../../models/meetings';

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

  requests: AdoptionRequestPopulated[] = [];
  requestModalOpen = false;
  selectedRequest: AdoptionRequestPopulated | null = null;

  imageFile?: File;

  meetings: AdminMeeting[] = [];

  constructor(
    private adminService: AdminService,
    private animalService: AnimalService,
    private requestService: AdoptionRequestService
  ) { }

  ngOnInit() {
    this.loadRequests();
    this.loadMeetings();
  }

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
        alert('Hír sikeresen létrehozva!');
        this.news.content = '';
        this.news.title = '';
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

    this.animalService.createAnimal(this.animal, this.imageFile).subscribe({
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

  loadRequests() {
    this.requestService.getAllRequests().subscribe({
      next: data => this.requests = data,
      error: err => console.error('Cannot load requests', err)
    });
  }

  private loadMeetings() {
    this.adminService.getUpcomingMeetings().subscribe({
      next: data => this.meetings = data,
      error: err => console.error('Nem sikerült betölteni a találkozókat', err)
    });
  }

  openRequestModal(req: AdoptionRequestPopulated) {
    this.selectedRequest = req;
    this.requestModalOpen = true;
  }
  closeRequestModal() {
    this.requestModalOpen = false;
    this.selectedRequest = null;
  }

  approve() {
    if (!this.selectedRequest) return;
    this.requestService.updateRequest(this.selectedRequest.adReId, 'approved')
      .subscribe({
        next: () => {
          alert('Kérelem jóváhagyva');
          this.closeRequestModal();
          this.loadRequests();
        },
        error: err => console.error(err)
      });
  }

  deny() {
    if (!this.selectedRequest) return;
    this.requestService.updateRequest(this.selectedRequest.adReId, 'rejected')
      .subscribe({
        next: () => {
          alert('Kérelem elutasítva');
          this.closeRequestModal();
          this.loadRequests();
        },
        error: err => console.error(err)
      });
  }

  delete() {
    if (!this.selectedRequest) return;
    this.requestService.deleteRequest(this.selectedRequest.adReId)
      .subscribe({
        next: () => {
          alert('Kérelem törölve');
          this.closeRequestModal();
          this.loadRequests();
        },
        error: err => console.error(err)
      });
  }

  onFileSelected(ev: Event) {
    const inp = ev.target as HTMLInputElement;
    if (inp.files?.length) {
      this.imageFile = inp.files[0];
    }
  }
}


