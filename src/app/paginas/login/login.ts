import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Autenticacion } from '../../servicios/autenticacion';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  mensaje = '';

  constructor(
    private auth: Autenticacion,
    private router: Router
  ) {}

  loginAdmin() {
    this.auth.loginComoAdmin();
    this.mensaje = 'Has iniciado sesión como Administrador.';
    this.router.navigate(['/admin']);
  }

  loginProgramador() {
    this.auth.loginComoProgramador();
    this.mensaje = 'Has iniciado sesión como Programador.';
    this.router.navigate(['/programador']);
  }

  entrarComoVisitante() {
    this.auth.cerrarSesion();
    this.mensaje = 'Estás navegando como visitante.';
    this.router.navigate(['/inicio']);
  }
}
