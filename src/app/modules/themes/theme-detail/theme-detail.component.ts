import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../../../_services/auth.service';
import { ThemeService } from '../../../_services/theme.service';
import { Theme, CATEGORY_ICONS } from '../../../_models/theme.model';

@Component({
  selector: 'app-theme-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './theme-detail.component.html',
  styleUrl: './theme-detail.component.scss',
})
export class ThemeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);

  theme$!: Observable<Theme>;
  isMember = signal(false);
  actionLoading = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.theme$ = this.themeService.getTheme(id);

    const uid = this.authService.getCurrentUser()?.uid;
    if (uid) {
      this.themeService.isMember(id, uid).then(m => this.isMember.set(m));
    }
  }

  async toggleMembership(themeId: string): Promise<void> {
    const uid = this.authService.getCurrentUser()?.uid;
    if (!uid) return;
    this.actionLoading.set(true);
    try {
      if (this.isMember()) {
        await this.themeService.leaveTheme(themeId, uid);
        this.isMember.set(false);
      } else {
        await this.themeService.joinTheme(themeId, uid);
        this.isMember.set(true);
      }
    } finally {
      this.actionLoading.set(false);
    }
  }

  getCategoryIcon(category: string): string {
    return (CATEGORY_ICONS as Record<string, string>)[category] ?? '✨';
  }

  getBudgetLabel(level: number): string {
    return '€'.repeat(level);
  }
}
