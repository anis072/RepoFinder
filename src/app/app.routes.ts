import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/repos', pathMatch: 'full' },
  {
    path: 'repos',
    loadComponent: () => import('./features/repos/repos.component').then(m => m.ReposComponent)
  },
  {
    path: 'commits/:repoFullName',
    loadComponent: () => import('./features/commit/commit.component').then(m => m.CommitComponent)
  },
  { path: '**', redirectTo: '/repos' }
];