import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard')
        .then(m => m.Dashboard)
    },
    {
        path: 'tasks',
        loadComponent: () => import('./features/tasks/task-list/task-list')
        .then(m => m.TaskList)
    },
     
    {
        path: 'tasks/:id',
        loadComponent: () => import('./features/tasks/task-detail/task-detail')
        .then(m => m.TaskDetail)
    },
   {
  path: 'users',
  loadComponent: () =>
    import('./features/users')
      .then(m => m.Users)
},

  {
    path: '**',
    redirectTo: 'dashboard'
   }

];
