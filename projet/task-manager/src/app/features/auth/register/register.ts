import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  private fb          = inject(FormBuilder);
  private authService = inject(AuthService);
  private router      = inject(Router);

  errorMessage  = signal<string>('');
  successMessage = signal<string>('');

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    confirm:  ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    const { username, email, password, confirm } = this.form.value;

    // Vérification mots de passe identiques
    if (password !== confirm) {
      this.errorMessage.set('Les mots de passe ne correspondent pas.');
      return;
    }

    const success = this.authService.register(username!, email!, password!);

    if (success) {
      this.successMessage.set('Compte créé ! Redirection...');
      setTimeout(() => this.router.navigate(['/login']), 1500);
    } else {
      this.errorMessage.set('Cet email est déjà utilisé.');
    }
  }
}