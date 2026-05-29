import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../_services/auth.service';
import { UserService } from '../../../_services/user.service';
import { UserProfile, UserFrequency } from '../../../_models/user.model';

const INTERESTS = [
  'Cuisine', 'Vins', 'Jazz', 'Tech', 'Startups', 'Randonnée',
  'Yoga', 'Musique', 'Cinéma', 'Voyage', 'Photographie', 'Lecture',
  'Sport', 'Art', 'Jeux de société', 'Electronic Music', 'Running', 'Surf',
];

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
})
export class EditProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  allInterests = INTERESTS;
  selectedInterests: string[] = [];
  loading = false;
  saving = false;
  photoFile: File | null = null;
  photoPreview: string | null = null;

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    bio: ['', Validators.maxLength(200)],
    city: ['', Validators.required],
    preferredFrequency: ['biweekly' as UserFrequency, Validators.required],
  });

  frequencies: { value: UserFrequency; label: string }[] = [
    { value: 'weekly', label: '1× par semaine' },
    { value: 'biweekly', label: '1× toutes les 2 semaines' },
    { value: 'monthly', label: '1× par mois' },
  ];

  ngOnInit(): void {
    const uid = this.authService.getCurrentUser()?.uid;
    if (!uid) return;
    this.loading = true;
    this.userService.getUser(uid).subscribe(user => {
      this.loading = false;
      if (!user) return;
      this.form.patchValue({
        firstName: user.firstName,
        bio: user.bio ?? '',
        city: user.city ?? '',
        preferredFrequency: user.preferredFrequency,
      });
      this.selectedInterests = [...(user.interests ?? [])];
    });
  }

  toggleInterest(interest: string): void {
    if (this.selectedInterests.includes(interest)) {
      this.selectedInterests = this.selectedInterests.filter(i => i !== interest);
    } else if (this.selectedInterests.length < 8) {
      this.selectedInterests = [...this.selectedInterests, interest];
    }
  }

  isSelected(interest: string): boolean {
    return this.selectedInterests.includes(interest);
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.photoFile = file;
    const reader = new FileReader();
    reader.onload = e => this.photoPreview = e.target?.result as string;
    reader.readAsDataURL(file);
  }

  async save(): Promise<void> {
    const uid = this.authService.getCurrentUser()?.uid;
    if (!uid || this.form.invalid) return;
    this.saving = true;
    try {
      let profilePhotoUrl: string | undefined;
      if (this.photoFile) {
        profilePhotoUrl = await this.userService.uploadProfilePhoto(uid, this.photoFile);
      }
      await this.userService.updateProfile(uid, {
        ...this.form.value as Partial<UserProfile>,
        interests: this.selectedInterests,
        ...(profilePhotoUrl ? { profilePhotoUrl } : {}),
      });
      this.router.navigate(['/profile']);
    } finally {
      this.saving = false;
    }
  }
}
