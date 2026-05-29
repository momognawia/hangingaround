import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Theme, CATEGORY_ICONS } from '../../_models/theme.model';

@Component({
  selector: 'app-theme-card',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './theme-card.component.html',
  styleUrl: './theme-card.component.scss',
})
export class ThemeCardComponent {
  @Input({ required: true }) theme!: Theme;

  get categoryIcon(): string {
    return CATEGORY_ICONS[this.theme.category] ?? '✨';
  }

  get budgetLabel(): string {
    return '€'.repeat(this.theme.restaurantBudgetLevel);
  }

  get spotsLeft(): number {
    return Math.max(0, 6 - (this.theme.membersCount % 6 || 6));
  }
}
