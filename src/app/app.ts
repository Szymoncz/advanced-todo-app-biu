import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { TaskService } from './core/services/task.service';
import { Task } from './core/models/task.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, MatMenuModule, MatBadgeModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('advanced-todo-app');

  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  taskService = inject(TaskService);

  isMobile = toSignal(
  this.breakpointObserver.observe('(max-width: 768px)').pipe(
    map(result => result.matches)
  ),
  { initialValue: false }
);

sidenavOpened = signal(true);

  toggleSidenav() {
    this.sidenavOpened.update(v => !v);
  }

  readNotifications = signal<Set<string>>(new Set());

  goToTask(task: Task) {
    this.readNotifications.update(set => new Set([...set, task.id]))
    this.router.navigate(['/tasks', task.id]);
  }

  isRead(taskId: string): boolean {
    return this.readNotifications().has(taskId);
  }

}
