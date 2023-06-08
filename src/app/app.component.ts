import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { NavigationService } from './services/navigation.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileModalComponent } from './components/profile-modal/profile-modal.component';
import { SocialAuthService } from '@abacritt/angularx-social-login';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private nav: NavigationService, private dialog: MatDialog) {}

  public isLogin$: Observable<boolean> = this.authService.isLoggedIn$

  ngOnInit() {
    this.authService.refresh().subscribe({
      // error: () => {console.log('unsuccess refresh')}
    })
  }

  logout() {
    this.authService.logout().subscribe(() => {this.nav.login()});
  }

  openUserProfileModal() {
    ProfileModalComponent.show(this.dialog)
  }
}
