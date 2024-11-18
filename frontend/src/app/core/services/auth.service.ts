import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

  constructor(private zone: NgZone) {}

  initializeGoogleOneTap(clientId: string): void {
    (window as any).google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: any) => this.handleCredentialResponse(response),
      auto_select: true,
    });

    (window as any).google.accounts.id.prompt();
  }

  private handleCredentialResponse(response: any): void {
    const idToken = response.credential;

    const base64Url = idToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = JSON.parse(atob(base64));

    const user = {
      name: jsonPayload.name,
      email: jsonPayload.email,
      picture: jsonPayload.picture,
    };

    this.zone.run(() => {
      this.userSubject.next(user);
    });
  }

  signIn(): void {
    (window as any).google.accounts.id.prompt();
  }

  signOut(): void {
    this.zone.run(() => {
      this.userSubject.next(null);
    });
  }
}
