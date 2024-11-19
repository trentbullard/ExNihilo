import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<any | null> = new BehaviorSubject<
    any | null
  >(null);
  private tokenKey = 'auth_token';

  get user$(): Observable<any | null> {
    return this.userSubject.asObservable();
  }

  constructor(private zone: NgZone) {}

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
    this.handleToken(idToken);
  }

  handleToken(token: string): void {
    this.saveToken(token);
    const decodedToken = this.decodeToken(token);

    const user = {
      name: decodedToken.name,
      email: decodedToken.email,
      picture: decodedToken.picture,
    };

    this.zone.run(() => {
      this.userSubject.next(user);
    });
  }

  signIn(): void {
    this.initializeGoogleOneTap();
    (window as any).google.accounts.id.prompt();
  }

  signOut(): void {
    this.clearToken();
    this.zone.run(() => {
      this.userSubject.next(null);
    });
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  decodeToken(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }
}
