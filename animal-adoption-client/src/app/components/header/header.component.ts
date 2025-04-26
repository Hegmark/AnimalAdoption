import { Component, HostListener } from '@angular/core';
import { LoginModalComponent } from "../login-modal/login-modal.component";
import { RegisterModalComponent } from "../register-modal/register-modal.component";
import { CommonModule } from "@angular/common";
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [LoginModalComponent, RegisterModalComponent, CommonModule, RouterModule],
})
export class HeaderComponent {
  menuOpen = false;
  loginModalOpen = false;
  registerModalOpen = false;
  isLoggedIn = false;
  private authSub!: Subscription;


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authSub = this.authService.isLoggedIn$.subscribe(isLogged => {
      this.isLoggedIn = isLogged;
    });

    this.authService.checkAuth().subscribe();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const menu = document.querySelector('.menu');
    const button = document.querySelector('.hamburger');

    if (this.menuOpen && menu && button) {
      const target = event.target as Node;
      if (!menu.contains(target) && !button.contains(target)) {
        this.closeMenu();
      }
    }
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  toggleLogin() {
    this.loginModalOpen = !this.loginModalOpen;
  }

  toggleRegister() {
    this.registerModalOpen = !this.registerModalOpen;
  }

  logout() {
    this.authService.logout().subscribe();
    this.router.navigate(['/']);
  }
}
