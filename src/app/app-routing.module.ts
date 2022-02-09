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
    path: 'modal-gambar',
    loadChildren: () => import('./modal/modal-gambar/modal-gambar.module').then( m => m.ModalGambarPageModule)
  },
  {
    path: 'modal-lupasandi',
    loadChildren: () => import('./modal/modal-lupasandi/modal-lupasandi.module').then( m => m.ModalLupasandiPageModule)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
