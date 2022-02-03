import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
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
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
