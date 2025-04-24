import { Component } from '@angular/core';
import { LoginModalComponent } from "../login-modal/login-modal.component";
import { RegisterModalComponent } from "../register-modal/register-modal.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [LoginModalComponent, RegisterModalComponent]
})
export class HeaderComponent {
  menuOpen = false;
  loginModalOpen = false;
  registerModalOpen = false;

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
}
