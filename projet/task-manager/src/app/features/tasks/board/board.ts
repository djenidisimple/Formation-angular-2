import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TaskService } from '../../../core/services/task.service';
import { TaskCardComponent } from '../task-card/task-card';
import { TaskFormComponent } from '../task-form/task-form';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [TaskCardComponent, TaskFormComponent],
  templateUrl: './board.html',
  styleUrl: './board.scss'
})
export class BoardComponent {
  private authService = inject(AuthService);
  private taskService = inject(TaskService);
  private router      = inject(Router);

  // Signals exposés au template
  readonly currentUser    = this.authService.currentUser;
  readonly todoTasks      = this.taskService.todoTasks;
  readonly inProgressTasks = this.taskService.inProgressTasks;
  readonly doneTasks      = this.taskService.doneTasks;

  showForm = false;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}