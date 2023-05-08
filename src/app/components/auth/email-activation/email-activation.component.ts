import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-email-activation',
  templateUrl: './email-activation.component.html',
  styleUrls: ['./email-activation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailActivationComponent {

  token = ''
  isError = new BehaviorSubject(false)

  constructor(private route: ActivatedRoute, private auth: AuthService, private nav: NavigationService) {
    this.route.params.subscribe(param => {
      this.token = param['token']
      if (this.token) {
        this.auth.activate(this.token).subscribe({
          next: () => this.nav.login(),
          error: () => this.isError.next(true)
        })
      }
    })
  }
}
