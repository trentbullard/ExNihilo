import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PrivacyComponent } from './features/privacy/privacy.component';
import { TOSComponent } from './features/tos/tos.component';
import { StartupComponent } from './features/startup/startup.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter([
      { path: '', component: StartupComponent },
      { path: 'privacy-policy', component: PrivacyComponent },
      { path: 'terms-of-service', component: TOSComponent },
      { path: '**', redirectTo: '' },
    ]),
  ],
};
