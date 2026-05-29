import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  navItems = [
    { path: '/home', icon: 'home', label: 'Accueil' },
    { path: '/themes', icon: 'explore', label: 'Explorer' },
    { path: '/chat', icon: 'chat_bubble', label: 'Chat' },
    { path: '/notifications', icon: 'notifications', label: 'Notifs' },
    { path: '/profile', icon: 'person', label: 'Profil' },
  ];
}
