import { Component } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { PoModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PoModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  data: string = ''

  constructor(
    private apiService: ApiService
  ) {}

  getData() {
    this.apiService.getData().subscribe({
      next:
      (req: any) => {
        console.log(req);
        this.data = req.base_date
      },
      error:
      (err: any) => {

      },
      complete:
      () => {

      }
    })
  }
}
