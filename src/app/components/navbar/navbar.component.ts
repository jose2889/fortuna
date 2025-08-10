import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    BadgeModule,
    AvatarModule,
    AvatarGroupModule,
    CommonModule,
    MenuModule,
    MenubarModule,
    InputTextModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  profileMenuItems: MenuItem[] = [];
  isMobileMenuOpen = false;
  isProfileMenuOpen = false;
  navbarScrolled = false;
  
  constructor(private elementRef: ElementRef) {}
  ngOnInit() {}

  logout() {
    console.log('Cerrando sesión...');
    // Aquí iría tu lógica de logout
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (
      this.isProfileMenuOpen &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.isProfileMenuOpen = false;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (window.scrollY > 10) {
      this.navbarScrolled = true;
    } else {
      this.navbarScrolled = false;
    }
  }
}
