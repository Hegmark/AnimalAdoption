import { Component, OnInit } from '@angular/core';
import { AdoptionRequestService } from '../../services/adoption-requests.service';
import { Router } from '@angular/router';
import { AdoptionRequest } from '../../models/adoption-request';
import { CommonModule } from '@angular/common';
import { AnimalService } from '../../services/animal.service';

@Component({
  selector: 'app-adoption-requests',
  templateUrl: './adoption-requests.component.html',
  styleUrls: ['./adoption-requests.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AdoptionRequestsComponent implements OnInit {
  requests: AdoptionRequest[] = [];

  constructor(
    private adoptionRequestService: AdoptionRequestService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.adoptionRequestService.getMyRequests().subscribe({
      next: (data) => this.requests = data,
      error: (err) => console.error('Failed to load adoption requests', err)
    });
  }

  goToAnimal(animalId: number) {
    this.router.navigate(['/animals', animalId]);
  }
}
