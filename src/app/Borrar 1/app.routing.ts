import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutaComponent }      from './ruta.component';

const appRoutes: Routes = [
  	{
    	path: 'ruta',
    	component: RutaComponent
  	}

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);