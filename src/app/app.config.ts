import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
<<<<<<< HEAD
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync()
=======
    provideHttpClient(), provideAnimationsAsync(), provideAnimationsAsync()
>>>>>>> cd19a00b748e39a6c599598ecea972eca37ce62a
  ]
};