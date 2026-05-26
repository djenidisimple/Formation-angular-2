import { Component, inject, input } from '@angular/core';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss'
})
export class TaskCardComponent {
  private taskService = inject(TaskService);

  // Input moderne Angular 17+ — signal input
  task = input.required<Task>();

  // Actions statut
  moveToInProgress(): void {
    this.taskService.updateStatus(this.task().id, 'in-progress');
  }

  moveToDone(): void {
    this.taskService.updateStatus(this.task().id, 'done');
  }

  moveToTodo(): void {
    this.taskService.updateStatus(this.task().id, 'todo');
  }

  delete(): void {
    this.taskService.deleteTask(this.task().id);
  }

  // Formate la date pour affichage
  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short'
    });
  }
}