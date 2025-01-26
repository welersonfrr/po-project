import { Component } from '@angular/core';
import { PoPageLoginModule } from '@po-ui/ng-templates';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    PoPageLoginModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor (
    private loginService: LoginService
  ) {}

  loginSubmit(data: any) {
    console.log(data);
    this.loginService.submitLogin(data)
  }
}
