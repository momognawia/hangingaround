import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable, switchMap, of } from 'rxjs';
import { AuthService } from '../../_services/auth.service';
import { ThemeService } from '../../_services/theme.service';
import { UserService } from '../../_services/user.service';
import { ThemeCardComponent } from '../../common/theme-card/theme-card.component';
import { Theme } from '../../_models/theme.model';
import { UserProfile } from '../../_models/user.model';

@Component({
  selector: 'app-home-feed',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule, ThemeCardComponent],
  templateUrl: './home-feed.component.html',
  styleUrl: './home-feed.component.scss',
})
export class HomeFeedComponent implements OnInit {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private userService = inject(UserService);

  user$!: Observable<UserProfile>;
  themes$!: Observable<Theme[]>;
  myThemes$!: Observable<Theme[]>;

  ngOnInit(): void {
    const uid = this.authService.getCurrentUser()?.uid;
    if (!uid) return;

    this.user$ = this.userService.getUser(uid);
    this.themes$ = this.user$.pipe(
      switchMap(user => this.themeService.getThemes(user?.city))
    );
  }

  getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }
}
