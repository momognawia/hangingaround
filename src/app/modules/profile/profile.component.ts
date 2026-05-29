import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import { UserProfile } from '../../_models/user.model';

const FREQ_LABELS: Record<string, string> = {
  weekly: '1× / semaine',
  biweekly: '1× / 2 semaines',
  monthly: '1× / mois',
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule, MatChipsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  user$!: Observable<UserProfile>;

  freqLabel = FREQ_LABELS;

  ngOnInit(): void {
    const uid = this.authService.getCurrentUser()?.uid;
    if (uid) this.user$ = this.userService.getUser(uid);
  }

  getInitials(name: string): string {
    return name?.charAt(0)?.toUpperCase() ?? '?';
  }

  getAge(birthDate: string): number {
    const diff = Date.now() - new Date(birthDate).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
