import {NgModule, Optional, SkipSelf} from '@angular/core';
import {fakeBackendProvider} from "./helper/fake-backend";
import {MockBackend} from "@angular/http/testing";
import {BaseRequestOptions} from "@angular/http";
import {StorageService} from "./services/storage.service";
import {AuthorizatedGuard} from "./guards/authorizated.guard";

@NgModule({/* DECORADOR DE NGMODULEM, ESTO ES PARA CREAR UN NUEVO MODULO */
  declarations: [  ],
  imports: [],
  providers: [
    StorageService,
    AuthorizatedGuard,
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions
  ],
  bootstrap: []
})/* FIN CREAR NUEVO MODULO*/

export class CoreModule {
              /*(@Optional() @SkipSelf() DECORADORES  Optional SkipSelf*/
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      /* throw: CAPTURANDO ERROR*/ /* DICE QUE HUBO UN ERROR AL QUERER VOLVER  
          A CARGAR EL COREMODULE, SOLO SE NECESITA CARGAR EL APPMODULE*/
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }/*FIN CONSTRUCTOR */
}
