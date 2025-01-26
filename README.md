# Configuração de App para Protheus e Navegador

## Configurações Angular

### Instalação do Angular CLI
```bash
npx -p @angular/cli@17
```

### Criação do Projeto PO-UI
```bash
ng new po-project --skip-install
```
**Escolha as seguintes opções:**
- Stylesheet: CSS
- SSR e SSG: Não

### Navegação para a pasta do projeto
```bash
cd po-project
```

### Instalação das bibliotecas necessárias
```bash
npm i @totvs/protheus-lib-core@17
ng add @po-ui/ng-components@17 # Escolha SideMenu = Yes
ng add @po-ui/ng-templates
```

### Abrir o projeto no VSCode
```bash
code .
```

## Criação e alteração de arquivos

### Tratamento de erro do provider window
Arquivo: `src/app/app.config.ts`
```typescript
providers: [
  ... // Demais providers
  { provide: "Window", useValue: window },
]
```

### Detectar a origem de abertura da rotina
Arquivo: `src/app/app.component.ts`
```typescript
import { ProtheusLibCoreModule, ProAppConfigService } from '@totvs/protheus-lib-core';

imports: [
  ProtheusLibCoreModule,
  ... // Demais imports
]

constructor(private proAppConfigService: ProAppConfigService) {
  if (this.proAppConfigService.insideProtheus()) {
    // Executando no Protheus
  } else {
    // Executando via Browser
  }
}
```

### Criar arquivo para receber parâmetros do Protheus
Arquivo: `src/assets/preload/advpltojs.js`
```javascript
(codeType, content) => {
  console.log(`Preload - codeType: ${codeType} - content: ${content}`);

  if (codeType == 'filiaisComAcesso') {
    sessionStorage.setItem('FILIAIS', content);
  }
  if (codeType == 'currentFilial') {
    sessionStorage.setItem('currentFilial', content);
  }
  if (codeType == 'currentEmpresa') {
    sessionStorage.setItem('currentEmpresa', content);
  }
}
```

### Configuração do ambiente

#### Desenvolvimento
Arquivo: `src/environments/environment.ts`
```typescript
export const environment = {
  ambiente: "browser",
  url: "URL_REST_DO_SEU_AMBIENTE",
  path: {
    login: "/api/oauth2/v1/token/",
    defaults: "/api/protheus/session/v1/defaults"
  },
}
```

#### Produção
Arquivo: `src/environments/environment.producao.ts`
```typescript
export const environment = {
  ambiente: "protheus",
  url: "URL_REST_DO_SEU_AMBIENTE",
  path: {
    login: "/api/oauth2/v1/token/",
    defaults: "/api/protheus/session/v1/defaults"
  },
}
```

### Ajustes no arquivo angular.json

Substituir em `projects > po-project > architect > build > options`:
```json
"outputPath": "dist/po-project"
```
Por:
```json
"outputPath": {
  "base": "dist/po-project",
  "browser": ""
},
```

Adicionar em `projects > po-project > architect > build > configurations`:
```json
"protheus": {
  "optimization": false,
  "extractLicenses": false,
  "sourceMap": true,
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.producao.ts"
    }
  ]
}
```

Com isso, ao rodar `ng serve`, o app deve estar acessível no navegador.

---

## Configuração do login

### Gerar componentes
```bash
ng g c pages/home
ng g c pages/login
```

### Configurar rotas
Arquivo: `src/app/app.routes.ts`
```typescript
export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "index.html", redirectTo: "" },
  { path: "login", component: LoginComponent }
];
```

### Ajustes no layout
Arquivo: `src/app/app.component.html`
```html
<router-outlet></router-outlet>
```

Arquivo: `src/app/pages/login/login.component.html`
```html
<po-page-login (p-login-submit)="loginSubmit($event)"/>
```

### Criar LoginService
```bash
ng g s services/login/login
```

Arquivo: `src/app/services/login.service.ts`
```typescript
submitLogin(data: any) {
  const uri = environment.url + environment.path.login;
  const params: HttpParams = new HttpParams()
    .set('grant_type', 'password')
    .set('username', data.login)
    .set('password', data.password);

  this.httpClient.post(uri, null, { params }).subscribe({
    next: (res) => { this.updateToken(res); },
    error: () => { this.notification.warning('Usuário ou senha incorretos!'); },
    complete: () => { this.notification.success('Login realizado com sucesso!'); this.router.navigate(["/"]); }
  });
}
```

---

## Configuração para uso no Protheus

### Build do projeto
```bash
ng build -c protheus
```

Compactar a pasta gerada em `.zip` e renomear para `.app`.

### Criar arquivo ADVPL
Arquivo: `TEST001.prw`
```advpl
#include "protheus.ch"
User Function TEST001()
  FwCallApp("po-project")
Return
```

### Acesso via browser
```text
http://<IP_SERVIDOR_PROTHEUS>:<PORTA>/app-root/po-project/
```

---

Esse tutorial cobre toda a configuração necessária para rodar a aplicação tanto via navegador quanto pelo Protheus.

