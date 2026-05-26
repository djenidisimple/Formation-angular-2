import { Component, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss'
})
export class TaskFormComponent {
  private fb          = inject(FormBuilder);
  private taskService = inject(TaskService);

  // Output moderne Angular 17+ — remplace @Output() EventEmitter
  taskCreated = output<void>();

  form = this.fb.group({
    title:       ['', [Validators.required, Validators.minLength(3)]],
    description: ['']
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    const { title, description } = this.form.value;
    this.taskService.addTask(title!, description ?? '');

    this.form.reset();
    this.taskCreated.emit();   // ferme le formulaire dans le Board
  }
}