import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TaskForm>);
  data: Partial<Task> = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  form = this.fb.group({
    title: [this.data.title ?? '', [Validators.required, Validators.minLength(3)]],
    description: [this.data.description ?? ''],
    notes: [this.data.notes ?? ''],
    status: [this.data.status ?? 'todo'],
    priority: [this.data.priority ?? 'medium'],
    dueDate: [this.data.dueDate ?? null],
    progress: [this.data.recurrence ?? 'none'],
  });

  get isEdit(): boolean {
    return !!this.data.id;
  }

  get titleerror(): string {
    const ctrl = this.form.get('title');
    if (ctrl?.hasError('required')) return 'Tytuł jest wymagany';
    if (ctrl?.hasError('minLength')) return 'Wymagane są minimum 3 znaki';
    return '';
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close();
  }

}
