import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//importlibrary
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { DatePipe } from '@angular/common';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
import { SetGetServiceService } from './services/set-get-service.service';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot()],
  providers: [HTTP, Camera, SetGetServiceService, FileTransfer, FileTransferObject, Network, DatePipe, WebView, Chooser,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
