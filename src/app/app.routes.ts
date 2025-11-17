import { Routes } from '@angular/router';

import { PaginaInicio } from './paginas/pagina-inicio/pagina-inicio';
import { AdminDashboard } from './paginas/admin-dashboard/admin-dashboard';
import { AdminProgramador } from './paginas/admin-programador/admin-programador';
import { Agendar } from './paginas/agendar/agendar';
import { Login } from './paginas/login/login';
import { Portafolio } from './paginas/portafolio/portafolio';

export const routes: Routes = [
    {path: '', redirectTo: 'inicio', pathMatch: 'full'},
    {path: 'inicio', component: PaginaInicio},
    {path: 'admin', component: AdminDashboard},
    {path: 'programador', component: AdminProgramador},
    {path: 'agendar', component: Agendar},
    {path: 'login', component: Login},
    {path: 'portafolios/:id', component: Portafolio},
    {path: '**' , redirectTo: 'inicio' }
];


