import { Injectable, signal, computed, inject } from '@angular/core';
import { Task, TaskStatus } from '../models/task.model';
import { AuthService } from './auth.service';

// Générateur d'ID universel — remplace crypto.randomUUID()
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

@Injectable({ providedIn: 'root' })
export class TaskService {

  private authService = inject(AuthService);
  private tasksSignal = signal<Task[]>(this.loadTasks());

  readonly myTasks = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return [];
    return this.tasksSignal().filter(t => t.userId === user.id);
  });

  readonly todoTasks       = computed(() => this.myTasks().filter(t => t.status === 'todo'));
  readonly inProgressTasks = computed(() => this.myTasks().filter(t => t.status === 'in-progress'));
  readonly doneTasks       = computed(() => this.myTasks().filter(t => t.status === 'done'));

  addTask(title: string, description: string): Task {
    const user = this.authService.currentUser()!;

    const newTask: Task = {
      id: generateId(),          // ✅ remplace crypto.randomUUID()
      title,
      description,
      status: 'todo',
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [...this.tasksSignal(), newTask];
    this.saveTasks(updated);
    return newTask;
  }

  updateStatus(taskId: string, status: TaskStatus): void {
    const updated = this.tasksSignal().map(t =>
      t.id === taskId
        ? { ...t, status, updatedAt: new Date().toISOString() }
        : t
    );
    this.saveTasks(updated);
  }

  updateTask(taskId: string, title: string, description: string): void {
    const updated = this.tasksSignal().map(t =>
      t.id === taskId
        ? { ...t, title, description, updatedAt: new Date().toISOString() }
        : t
    );
    this.saveTasks(updated);
  }

  deleteTask(taskId: string): void {
    const updated = this.tasksSignal().filter(t => t.id !== taskId);
    this.saveTasks(updated);
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem('tm_tasks', JSON.stringify(tasks));
    this.tasksSignal.set(tasks);
  }

  private loadTasks(): Task[] {
    const raw = localStorage.getItem('tm_tasks');
    return raw ? JSON.parse(raw) : [];
  }
}