import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private http: HttpClient) {}

  close() {
    this.closeModal.emit();
  }

  onSubmit() {
    this.http.post('/api/auth/login', { email: this.email, password: this.password })
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          this.close();
          location.reload();
        },
        error: () => {
          this.error = 'Hibás email vagy jelszó.';
        }
      });
  }
}
