import { Component, OnInit } from '@angular/core';
import { AuthService }       from '../../services/auth.service';
import { Meeting }           from '../../models/meetings';
import { Router }            from '@angular/router';
import { CommonModule }      from '@angular/common';
import { RouterModule }      from '@angular/router';

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss']
})
export class MeetingsComponent implements OnInit {
  meetings: Meeting[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getMeetings().subscribe({
      next: (data) => this.meetings = data,
      error: (err) => console.error('Could not load meetings', err)
    });
  }

  goToAnimal(animalId: number) {
    this.router.navigate(['/animals', animalId]);
  }
}
