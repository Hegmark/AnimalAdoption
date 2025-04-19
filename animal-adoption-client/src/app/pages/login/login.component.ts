import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, CommonModule, RouterModule],
})
export class LoginComponent {

  email = '';
  password = '';
  error: string | null = null;

  constructor(private router: Router, private authService: AuthService) { }

  onSubmit() {
    if (this.email && this.password) {
      this.error = '';
      this.authService.login(this.email, this.password).subscribe({
        next: (data) => {
          if (data) {
            console.log(data);
            //this.router.navigateByUrl('/user-management');
          }
        }, error: (err) => {
          console.log(err);
        },
      })
    } else {
      this.error = 'Form is empty.';
    }
  }

  onRegister() {
    this.authService.checkAuth().subscribe({
      next: (data) => {
        if (data) {
          console.log(data);
          //this.router.navigateByUrl('/user-management');
        }
      }, error: (err) => {
        console.log(err);
      },
    })
    }
}
