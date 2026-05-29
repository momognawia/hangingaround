import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { AuthService } from '../../../_services/auth.service';
import { ThemeService } from '../../../_services/theme.service';
import { THEME_CATEGORIES, CATEGORY_ICONS } from '../../../_models/theme.model';

@Component({
  selector: 'app-create-theme',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatSliderModule,
  ],
  templateUrl: './create-theme.component.html',
  styleUrl: './create-theme.component.scss',
})
export class CreateThemeComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private router = inject(Router);

  loading = false;
  categories = THEME_CATEGORIES;
  categoryIcons = CATEGORY_ICONS;

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]],
    description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(300)]],
    category: ['Food', Validators.required],
    city: ['', Validators.required],
    ageMin: [21],
    ageMax: [45],
    maxMembers: [60],
    frequency: ['biweekly', Validators.required],
    restaurantBudgetLevel: [2, Validators.required],
  });

  frequencies = [
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'biweekly', label: 'Bi-mensuel' },
    { value: 'monthly', label: 'Mensuel' },
  ];

  budgets = [
    { value: 1, label: '€ — Moins de 20€' },
    { value: 2, label: '€€ — 20–40€' },
    { value: 3, label: '€€€ — 40–70€' },
    { value: 4, label: '€€€€ — Plus de 70€' },
  ];

  get selectedCategory(): string {
    return this.form.get('category')?.value ?? 'Food';
  }

  getCategoryIcon(cat: string): string {
    return (this.categoryIcons as Record<string, string>)[cat] ?? '✨';
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    const uid = this.authService.getCurrentUser()?.uid;
    if (!uid) return;
    this.loading = true;
    try {
      const v = this.form.value;
      const id = await this.themeService.createTheme({
        creatorUserId: uid,
        title: v.title!,
        description: v.description!,
        category: v.category as any,
        city: v.city!,
        ageMin: v.ageMin!,
        ageMax: v.ageMax!,
        maxMembers: v.maxMembers!,
        targetGroupSize: 6,
        frequency: v.frequency!,
        restaurantBudgetLevel: v.restaurantBudgetLevel as any,
        status: 'active',
      });
      this.router.navigate(['/themes', id]);
    } finally {
      this.loading = false;
    }
  }
}
