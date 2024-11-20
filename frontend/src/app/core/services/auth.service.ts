import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<any | null> = new BehaviorSubject<
    any | null
  >(null);

  get user$(): Observable<any | null> {
    return this.userSubject.asObservable();
  }

  constructor(private zone: NgZone, private apiService: ApiService) {}

  initializeGoogleOneTap(): void {
    (window as any).google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleCredentialResponse(response),
      auto_select: true,
    });

    (window as any).google.accounts.id.prompt();
  }

  private handleCredentialResponse(response: any): void {
    const idToken = response.credential;

    this.apiService.post('auth/google', { idToken }).subscribe({
      next: (user: any) => {
        this.zone.run(() => {
          this.userSubject.next(user);
        });
      },
      error: (error: any) => {
        console.error('Authentication error:', error);
      },
    });
  }

  checkSession(): void {
    this.apiService.get('auth/session').subscribe({
      next: (user: any) => {
        this.zone.run(() => {
          this.userSubject.next(user);
        });
      },
      error: (error: any) => {
        console.error('Session error:', error);
        this.initializeGoogleOneTap();
      },
    });
  }

  signIn(): void {
    this.initializeGoogleOneTap();
  }

  signOut(): void {
    this.apiService.post('auth/logout', {}).subscribe({
      next: () => {
        this.zone.run(() => {
          this.userSubject.next(null);
        });
      },
      error: (error: any) => {
        console.error('Logout error:', error);
      },
    });
  }

  getApiAuthToken(input: string): string {
    const thisMinute = new Date().toISOString().slice(0, 16);
    return CryptoJS.HmacSHA512(
      thisMinute + input,
      environment.apiAuthSecret
    ).toString();
  }
}
