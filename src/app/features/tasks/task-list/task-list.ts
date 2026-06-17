import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskService } from '../../../core/services/task.service';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { MatDialog } from '@angular/material/dialog';
import { TaskForm } from '../task-form/task-form';

@Component({
  selector: 'app-task-list',
  imports: [
    RouterLink,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskList {
  taskService = inject(TaskService);

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.taskService.setSearchQuery(value);
  }

  onPriorityFilter(value: string) {
    this.taskService.setFilterPriority(value as any);
  }

  onStatusFilter(value: string) {
    this.taskService.setFilterStatus(value as any);
  }

  statusLabel(status: TaskStatus): string {
    const labels: Record<TaskStatus, string> = {
      'todo': 'Do zrobienia',
      'in-progress': 'W trakcie',
      'done': 'Ukończone'
    };
    return labels[status];
  }

  private dialog = inject(MatDialog);

  openForm() {
    const ref = this.dialog.open(TaskForm, {
      width: '600px'
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.addTask({
          ...result,
          labels: [],
          projectId: null,
          assignedTo: null,
          attachmnents: []
        }).subscribe();
      }
    });
  }

  editTask(task: Task) {
    const ref = this.dialog.open(TaskForm, {
      width: '600px',
      data: task
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.updateTask(task.id, result).subscribe();
      }
    });
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe();
  }
}