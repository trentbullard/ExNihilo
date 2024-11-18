import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-startup',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.scss'],
})
export class StartupComponent {
  currentDate: Date;
  user: any = null;

  constructor(private authService: AuthService) {
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      this.user = user;
    });
  }
}
