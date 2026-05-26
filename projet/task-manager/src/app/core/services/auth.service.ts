import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';

// Générateur d'ID universel — remplace crypto.randomUUID()
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUserSignal = signal<User | null>(this.loadCurrentUser());
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);

  register(username: string, email: string, password: string): boolean {
    const users = this.getUsers();
    const exists = users.find(u => u.email === email);
    if (exists) return false;

    const newUser: User = {
      id: generateId(),          // ✅ remplace crypto.randomUUID()
      username,
      email,
      password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('tm_users', JSON.stringify(users));
    return true;
  }

  login(email: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return false;
    localStorage.setItem('tm_current_user', JSON.stringify(user));
    this.currentUserSignal.set(user);
    return true;
  }

  logout(): void {
    localStorage.removeItem('tm_current_user');
    this.currentUserSignal.set(null);
  }

  private getUsers(): User[] {
    const raw = localStorage.getItem('tm_users');
    return raw ? JSON.parse(raw) : [];
  }

  private loadCurrentUser(): User | null {
    const raw = localStorage.getItem('tm_current_user');
    return raw ? JSON.parse(raw) : null;
  }
}