import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  PoMenuItem,
  PoMenuModule,
  PoPageModule,
  PoToolbarModule,
} from '@po-ui/ng-components';

import { ProtheusLibCoreModule, ProAppConfigService } from '@totvs/protheus-lib-core';
import { LoginService } from './services/login/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PoToolbarModule,
    PoMenuModule,
    PoPageModule,
    HttpClientModule,
    ProtheusLibCoreModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  excludedRoutes = ['/login']; // Adicione rotas que não devem exibir os wrappers
  constructor(
    private proAppConfigService: ProAppConfigService,
    private router: Router,
    private loginService: LoginService
  ) {
    if (this.proAppConfigService.insideProtheus()) {
      // Executando no protheus
      this.proAppConfigService.loadAppConfig();
      this.router.navigate(['/'])
    } else {
      // Executando via Browse
      this.loginService.getAccessToken()
    }
  }

  readonly menus: Array<PoMenuItem> = [
    { label: 'Home', action: this.onClick.bind(this) },
  ];

  private onClick() {
    alert('Clicked in menu item');
  }

  isExcludedRoute(): boolean {
    return this.excludedRoutes.includes(this.router.url);
  }
}
