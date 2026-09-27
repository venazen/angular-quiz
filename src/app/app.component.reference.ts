// Ovo je REFERENCA, ne zamjenjuj svoj app.component.ts/app.ts direktno njome.
// Samo se uvjeri da tvoj root komponenta (bilo da se zove AppComponent ili App,
// zavisno od verzije CLI-a) ima RouterOutlet u imports i <router-outlet /> u template-u.

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {}
