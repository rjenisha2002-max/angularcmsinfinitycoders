import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-pharmacy-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './pharmacy-layout.html',
  styleUrl: './pharmacy-layout.css'
})
export class PharmacyLayout {
  sidebarCollapsed = false;

  constructor(public authService: AuthService) {}

  get username(): string {
    return this.authService.getUsername() ?? 'Pharmacist';
  }

  logout(): void {
    // logOutRemoveItems — matches professor's method name exactly.
    // Calls POST /api/login/logout (clears server session) then clears localStorage.
    this.authService.logOutRemoveItems();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
