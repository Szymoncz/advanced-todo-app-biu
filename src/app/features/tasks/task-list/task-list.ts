import { Component, inject, ViewChild, ElementRef } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';

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
      width: '600px',
    maxWidth: '95vw'
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
    maxWidth: '95vw',
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

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  triggerImport() {
    this.fileInput.nativeElement.click();
  }

  importFromCSV(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      this.parseAndImport(text);
    };
    reader.readAsText(file);
    input.value = '';
  }



  exportToCSV() {
    const tasks = this.taskService.filteredTasks();
    const headers = ['ID', 'Tytuł', 'Opis', 'Status', 'Priorytet', 'Termin', 'Postęp', 'Powtarzalność'];
    const rows = tasks.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.status,
      t.priority,
      t.dueDate ?? '',
      t.progress,
      t.recurrence
    ]);

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private snackBar = inject(MatSnackBar);

  private parseAndImport(csvText: string) {
    const lines = csvText.trim().split('\n');
    const dataLines = lines.slice(1);
    const existingTitles = new Set(this.taskService.tasks().map(t => t.title.toLowerCase()));

    let added = 0;
    let skipped = 0;

    dataLines.forEach(line => {
      const values = this.parseCSVLine(line);
      if (values.length < 8) return;

      const [, title, description, status, priority, dueDate, progress, recurrence] = values;
      
      if (existingTitles.has(title.toLowerCase())) {
        skipped++;
        return;
      }

      existingTitles.add(title.toLowerCase());
      added++;

      this.taskService.addTask({
        title,
        description,
        notes: '',
        status: status as any,
        priority: priority as any,
        labels: [],
        projectId: null,
        assignedTo: null,
        dueDate: dueDate || null,
        recurrence: recurrence as any,
        progress: Number(progress) || 0,
        attachments: []
      }).subscribe();
    });

    this.snackBar.open(
      `Zaimportowano ${added} zadań, pominięto ${skipped} z powodu duplikatów`,
      'OK',
      { duration: 4000 }
    )
  }

  private parseCSVLine(line: string): string [] {
    const result: string[] = [];
    let current = '';
    let insideQuotes = false;
  
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
  
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  userService = inject(UserService);

getUserName(id: string): string {
  return this.userService.getUserById(id)?.name ?? 'Nieznany';
}

getUserAvatar(id: string): string {
  return this.userService.getUserById(id)?.avatar ?? '?';
}
}