import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatToolbarModule, MatIconModule, MatMenuModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  title = 'ExNihilo';
  user: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      this.user = user;
    });

    this.authService.initializeGoogleOneTap(
      '222659911685-ulfsp7uu4fd6usp3mdmmrfio4bubud1q.apps.googleusercontent.com'
    );
  }
  
  onClickLogin(): void {
    this.authService.signIn();
  }

  signOut(): void {
    this.authService.signOut();
  }
}
