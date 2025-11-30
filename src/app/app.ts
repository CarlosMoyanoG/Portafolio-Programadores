import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive, RouterLink, Router, NavigationEnd } from '@angular/router';
import { Autenticacion } from './servicios/autenticacion';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ProyectoPortafolio');

  mostrarLayout = true;

  constructor(public auth: Autenticacion, private router: Router){

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.mostrarLayout = !e.urlAfterRedirects.startsWith('/login');
      });
  }
}


