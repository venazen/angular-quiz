import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ALL_TESTS } from '../../data/tests';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  protected readonly progressService = inject(ProgressService);
  protected readonly tests = ALL_TESTS;
}
