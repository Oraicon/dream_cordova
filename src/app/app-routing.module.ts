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
    path: 'modal-kegiatan',
    loadChildren: () => import('./modal/modal-kegiatan/modal-kegiatan.module').then( m => m.ModalKegiatanPageModule)
  },
  {
    path: 'modal-lupasandi',
    loadChildren: () => import('./modal/modal-lupasandi/modal-lupasandi.module').then( m => m.ModalLupasandiPageModule)
  },
  {
    path: '',
    redirectTo: '/tabs/tab2',
    // redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'modal-gantisandi',
    loadChildren: () => import('./modal/modal-gantisandi/modal-gantisandi.module').then( m => m.ModalGantisandiPageModule)
  },  {
    path: 'proses',
    loadChildren: () => import('./pages/proses/proses.module').then( m => m.ProsesPageModule)
  },
  {
    path: 'selesai',
    loadChildren: () => import('./pages/selesai/selesai.module').then( m => m.SelesaiPageModule)
  },
  {
    path: 'proses-log',
    loadChildren: () => import('./pages/proses-log/proses-log.module').then( m => m.ProsesLogPageModule)
  }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
