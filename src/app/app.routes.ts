import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('./features/dashboard/dashboard')
        .then(m => m.Dashboard)
    },
    {
        path: 'tasks',
        canActivate: [authGuard],
        loadComponent: () => import('./features/tasks/task-list/task-list')
        .then(m => m.TaskList)
    },
     
    {
        path: 'tasks/:id',
        canActivate: [authGuard],
        loadComponent: () => import('./features/tasks/task-detail/task-detail')
        .then(m => m.TaskDetail)
    },
   {
  path: 'users',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/users')
      .then(m => m.Users)
},
{
    path: 'login',
    loadComponent: () => import('./features/auth/login')
    .then(m => m.Login)
},
{
    path: 'users',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/users')
    .then(m => m.Users)
},

  {
    path: '**',
    redirectTo: 'dashboard'
   }

];
