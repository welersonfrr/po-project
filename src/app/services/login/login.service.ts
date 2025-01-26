import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PoNotificationService } from '@po-ui/ng-components';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    public httpClient: HttpClient,
    private router: Router,
    private notification: PoNotificationService
  ) { }

  submitLogin(data: any) {
    const uri = environment.url + environment.path.login
    const params: HttpParams = new HttpParams()
      .set('grant_type','password')
      .set('username', data.login)
      .set('password', data.password)

    this.httpClient.post(uri, null, { params }).subscribe(
      {
        next:
        (res)=>{
          this.updateToken(res)
        },
        error:
        (error: any) => {
          this.notification.warning('Usuário ou senha incorretos! por favor verifique.')
        },
        complete:
        () => {
          this.notification.success('Login realizado com sucesso!')
          this.router.navigate(["/"])
        }
      }
    )
    return
  }

  updateToken(data: any) {
    sessionStorage.setItem('ERPTOKEN', JSON.stringify(data))
  }

  getAccessToken() {
    const erpToken = sessionStorage.getItem('ERPTOKEN')
    if (erpToken == null) {
      this.notification.warning('Por favor realize o login!')
      this.router.navigate(["/login"])
    } else {
      return JSON.parse(erpToken).access_token
    }
  }

}
