import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from '../../../core/services/task.service';
import { TaskForm } from '../task-form/task-form';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-task-detail',
  imports: [
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.scss',
})
export class TaskDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  taskService = inject(TaskService);

  taskId = toSignal(this.route.params.pipe(map(p => p['id'])),
    { initialValue: this.route.snapshot.params['id'] }
  );

  task = computed(() => this.taskService.tasks().find(t => t.id === this.taskId()));
  
  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      'todo': 'Do zrobienia',
      'in-progress': 'W trakcie',
      'done': 'Ukończone'
    };
    return labels[status] ?? status;
  }

  recurrenceLabel(recurrence: string): string {
    const labels: Record<string, string> = {
      'none': 'Brak',
      'daily': 'Codziennie',
      'weekly': 'Co tydzień',
      'monthly': 'Co miesiąc',
      'yearly': 'Co rok'
    };
    return labels[recurrence] ?? recurrence;
  }

  priorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    'low': '🟢 Niski',
    'medium': '🟡 Średni',
    'high': '🟠 Wysoki',
    'urgent': '🔴 Pilny'
  };
  return labels[priority] ?? priority;
}

  editTask() {
    const currentTask = this.task();
    if (!currentTask) return;

    const ref = this.dialog.open(TaskForm, {
      width: '600px',
      maxWidth: '95vw',
      data: currentTask
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.updateTask(currentTask.id, result).subscribe();
      }
    });
  }

  deleteTask() {
    const currentTask = this.task();
    if (!currentTask) return;

    this.taskService.deleteTask(currentTask.id).subscribe(() => {
      this.router.navigate(['/tasks']);
    });
  }

  goBack() {
    this.router.navigate(['/tasks']);
  }

}
