import { Routes } from '@angular/router';
import { authGuard } from './_guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./modules/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./modules/auth/onboarding/onboarding.component').then(m => m.OnboardingComponent),
    canActivate: [authGuard],
  },

  {
    path: '',
    loadComponent: () => import('./shell/shell.component').then(m => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./modules/home-feed/home-feed.component').then(m => m.HomeFeedComponent),
      },
      {
        path: 'themes',
        loadComponent: () => import('./modules/themes/themes-list/themes-list.component').then(m => m.ThemesListComponent),
      },
      {
        path: 'themes/create',
        loadComponent: () => import('./modules/themes/create-theme/create-theme.component').then(m => m.CreateThemeComponent),
      },
      {
        path: 'themes/:id',
        loadComponent: () => import('./modules/themes/theme-detail/theme-detail.component').then(m => m.ThemeDetailComponent),
      },
      {
        path: 'events/:id',
        loadComponent: () => import('./modules/events/event-detail/event-detail.component').then(m => m.EventDetailComponent),
      },
      {
        path: 'chat',
        loadComponent: () => import('./modules/chat/chat-list/chat-list.component').then(m => m.ChatListComponent),
      },
      {
        path: 'chat/:roomId',
        loadComponent: () => import('./modules/chat/chat-room/chat-room.component').then(m => m.ChatRoomComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./modules/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: 'profile/edit',
        loadComponent: () => import('./modules/profile/edit-profile/edit-profile.component').then(m => m.EditProfileComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./modules/settings/settings.component').then(m => m.SettingsComponent),
      },
      {
        path: 'notifications',
        loadComponent: () => import('./modules/notifications/notifications.component').then(m => m.NotificationsComponent),
      },
      {
        path: 'admin',
        loadComponent: () => import('./modules/admin/admin-shell/admin-shell.component').then(m => m.AdminShellComponent),
      },
    ],
  },

  { path: '**', redirectTo: '/home' },
];
