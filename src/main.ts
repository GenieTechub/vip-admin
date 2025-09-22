import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// ✅ PrimeNG
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: Aura,
      }
    }),
    provideHttpClient(
      withInterceptors([
        (req, next) => {
          const token = localStorage.getItem('adminToken');

          const skipAuth =
            req.url.includes('/auth/login') || req.url.includes('/auth/register');

          if (token && !skipAuth) {
            const authReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
              },
            });
            return next(authReq);
          }

          return next(req);
        },
      ])
    ),
    importProvidersFrom(FormsModule, ReactiveFormsModule),
  ],
}).catch((err) => console.error(err));
