import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../_services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  }, { validators: this.passwordMatch });

  loading = false;
  error = '';
  showPassword = false;

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    try {
      const { email, password, firstName } = this.form.value;
      await this.auth.registerWithEmail(email!, password!, firstName!);
    } catch (e: any) {
      this.error = this.mapError(e.code);
    } finally {
      this.loading = false;
    }
  }

  async registerWithGoogle(): Promise<void> {
    this.loading = true;
    this.error = '';
    try {
      await this.auth.loginWithGoogle();
    } catch {
      this.error = 'Connexion Google échouée. Réessayez.';
    } finally {
      this.loading = false;
    }
  }

  private passwordMatch(group: any) {
    const pw = group.get('password')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw === cpw ? null : { mismatch: true };
  }

  private mapError(code: string): string {
    const map: Record<string, string> = {
      'auth/email-already-in-use': 'Cet email est déjà utilisé.',
      'auth/weak-password': 'Mot de passe trop faible (8 caractères min).',
    };
    return map[code] ?? 'Une erreur est survenue.';
  }
}
