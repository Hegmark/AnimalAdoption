import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimalService } from '../../services/animal.service';
import { AuthService } from '../../services/auth.service';
import { Animal } from '../../models/animal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdoptionRequestService } from '../../services/adoption-requests.service';

@Component({
  selector: 'app-animal-detail',
  templateUrl: './animal-detail.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./animal-detail.component.scss']
})
export class AnimalDetailComponent implements OnInit {
  animal: Animal | null = null;
  isLoggedIn = false;
  meetingDate: string = '';
  message: string = '';
  private authSub!: Subscription;
  adoptModalOpen = false;
  adoptionDate: string = '';
  adoptionMessage: string = '';
  today: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animalService: AnimalService,
    private authService: AuthService,
    private adoptionRequestService: AdoptionRequestService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.animalService.getAnimalById(id).subscribe({
      next: (animal) => this.animal = animal,
      error: (err) => {
        console.error('Failed to load animal', err);
        this.router.navigate(['/animals']);
      }
    });

    this.authSub = this.authService.isLoggedIn$.subscribe(isLogged => {
      this.isLoggedIn = isLogged;
    });

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.today = `${yyyy}-${mm}-${dd}`;
  }

  openAdoptModal() {
    this.adoptionDate = '';
    this.adoptionMessage = '';
    this.adoptModalOpen = true;
  }

  closeAdoptModal() {
    this.adoptModalOpen = false;
  }

  scheduleMeeting() {
    if (!this.meetingDate) {
      alert('Kérlek válassz időpontot!');
      return;
    }

    // Here you would call AdoptionRequestService to create a request
    alert(`Találkozó időpont lefoglalva: ${this.meetingDate} üzenettel: "${this.message}"`);
    // After real backend call, reset fields
    this.meetingDate = '';
    this.message = '';
  }

  submitAdoptionRequest() {
    if (!this.adoptionDate || !this.adoptionMessage || !this.animal) {
      alert('Minden mezőt ki kell tölteni!');
      return;
    }

    this.adoptionRequestService.createAdoptionRequest({
      animalId: this.animal.animalId,
      adoptionDate: new Date(this.adoptionDate).toISOString(),
      message: this.adoptionMessage
    }).subscribe({
      next: () => {
        alert('Örökbefogadási kérelem sikeresen elküldve!');
        this.closeAdoptModal();
      },
      error: (err) => {
        console.error('Failed to create adoption request', err);
        alert('Hiba történt az örökbefogadási kérelem elküldésekor.');
      }
    });
  }
}
