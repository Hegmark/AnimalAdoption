import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  imports: [
    FormsModule,
    CommonModule
  ],
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  email = '';
  password = '';
  error: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  close() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.error = 'Kérlek töltsd ki az összes mezőt.';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.closeModal.emit();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Hibás email vagy jelszó.';
      }
    });
  }
}
