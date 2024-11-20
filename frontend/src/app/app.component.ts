import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToolbarComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  user: any = null;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      this.user = user;
    });

    this.authService.checkSession();
  }
}
