import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { UserService } from '../core/services/user.service';
import { TaskService } from '../core/services/task.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    DecimalPipe
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  userService = inject(UserService);
  taskService = inject(TaskService);
  private router = inject(Router);

  getTaskCount(userId: string): number {
    return this.taskService.tasks().filter(t => t.assignedTo === userId).length;
  }

  getDoneCount(userId: string): number {
    return this.taskService.tasks().filter(t => t.assignedTo === userId && t.status === 'done').length;
  }

  goToTasks(userId: string) {
    this.taskService.setFilterUser(userId);
    this.router.navigate(['/tasks']);
  }
}