import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GuardServiceService } from './services/guard-service.service';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [GuardServiceService]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'proses',
    loadChildren: () => import('./pages/proses/proses.module').then( m => m.ProsesPageModule),
    canActivate: [GuardServiceService]
  },
  {
    path: 'lapor',
    loadChildren: () => import('./pages/lapor/lapor.module').then( m => m.LaporPageModule),
    canActivate: [GuardServiceService]
  },
  {
    path: 'kegiatan',
    loadChildren: () => import('./pages/kegiatan/kegiatan.module').then( m => m.KegiatanPageModule),
    canActivate: [GuardServiceService]
  },
  {
    path: 'modal-gantisandi',
    loadChildren: () => import('./modal/modal-gantisandi/modal-gantisandi.module').then( m => m.ModalGantisandiPageModule)
  },
  {
    path: 'modal-gantinama',
    loadChildren: () => import('./modal/modal-gantinama/modal-gantinama.module').then( m => m.ModalGantinamaPageModule)
  },
  {
    path: 'modal-lupasandi',
    loadChildren: () => import('./modal/modal-lupasandi/modal-lupasandi.module').then( m => m.ModalLupasandiPageModule)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },  {
    path: 'list',
    loadChildren: () => import('./pages/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'modal-isikonten',
    loadChildren: () => import('./modal/modal-isikonten/modal-isikonten.module').then( m => m.ModalIsikontenPageModule)
  }




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
