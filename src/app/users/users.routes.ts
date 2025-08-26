import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/user-list/user-list').then(c => c.UserListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./components/user-form/user-form').then(c => c.UserFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./components/user-detail/user-detail').then(c => c.UserDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./components/user-form/user-form').then(c => c.UserFormComponent)
  }
];
