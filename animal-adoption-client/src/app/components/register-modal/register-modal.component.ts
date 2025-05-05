import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  imports: [
    FormsModule,
    CommonModule
  ],
  styleUrls: ['./register-modal.component.scss']
})
export class RegisterModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  username = '';
  email = '';
  password = '';
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  close() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (!this.email || !this.password || !this.username) {
      this.error = 'Kérlek töltsd ki az összes mezőt.';
      return;
    }

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: (res) => {
        this.closeModal.emit();
        this.authService.login(this.email, this.password).subscribe();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Hibás email vagy jelszó.';
      }
    });
  }
}
