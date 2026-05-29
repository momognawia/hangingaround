import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../../_services/auth.service';
import { UserService } from '../../../_services/user.service';
import { Gender, Orientation, UserFrequency } from '../../../_models/user.model';

const INTERESTS = [
  'Cuisine', 'Vins', 'Jazz', 'Tech', 'Startups', 'Randonnée',
  'Yoga', 'Musique', 'Cinéma', 'Voyage', 'Photographie', 'Lecture',
  'Sport', 'Art', 'Jeux de société', 'Electronic Music', 'Running', 'Surf',
];

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatButtonModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatChipsModule, MatIconModule, MatProgressBarModule,
  ],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
})
export class OnboardingComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  step = signal(1);
  totalSteps = 3;
  loading = false;

  allInterests = INTERESTS;
  selectedInterests = signal<string[]>([]);

  step1 = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    birthDate: ['', Validators.required],
    gender: ['', Validators.required],
    city: ['', Validators.required],
  });

  step2 = this.fb.group({
    bio: ['', [Validators.maxLength(200)]],
    orientation: ['prefer_not'],
  });

  step3 = this.fb.group({
    preferredFrequency: ['biweekly', Validators.required],
  });

  get progress(): number {
    return (this.step() / this.totalSteps) * 100;
  }

  toggleInterest(interest: string): void {
    const current = this.selectedInterests();
    if (current.includes(interest)) {
      this.selectedInterests.set(current.filter(i => i !== interest));
    } else if (current.length < 8) {
      this.selectedInterests.set([...current, interest]);
    }
  }

  isSelected(interest: string): boolean {
    return this.selectedInterests().includes(interest);
  }

  nextStep(): void {
    if (this.step() < this.totalSteps) {
      this.step.set(this.step() + 1);
    }
  }

  prevStep(): void {
    if (this.step() > 1) {
      this.step.set(this.step() - 1);
    }
  }

  async finish(): Promise<void> {
    const uid = this.authService.getCurrentUser()?.uid;
    if (!uid) return;
    this.loading = true;
    try {
      await this.userService.updateProfile(uid, {
        ...this.step1.value as any,
        ...this.step2.value as any,
        preferredFrequency: this.step3.value.preferredFrequency as UserFrequency,
        interests: this.selectedInterests(),
      });
      this.router.navigate(['/home']);
    } finally {
      this.loading = false;
    }
  }

  genders: { value: Gender; label: string }[] = [
    { value: 'male', label: 'Homme' },
    { value: 'female', label: 'Femme' },
    { value: 'non_binary', label: 'Non-binaire' },
    { value: 'other', label: 'Autre' },
  ];

  orientations: { value: Orientation; label: string }[] = [
    { value: 'straight', label: 'Hétérosexuel(le)' },
    { value: 'gay', label: 'Gay' },
    { value: 'lesbian', label: 'Lesbienne' },
    { value: 'bisexual', label: 'Bisexuel(le)' },
    { value: 'prefer_not', label: 'Préfère ne pas préciser' },
  ];

  frequencies: { value: UserFrequency; label: string; desc: string }[] = [
    { value: 'weekly', label: '1× par semaine', desc: '4 dîners/mois' },
    { value: 'biweekly', label: '1× toutes les 2 semaines', desc: '2 dîners/mois' },
    { value: 'monthly', label: '1× par mois', desc: '1 dîner/mois' },
  ];
}
