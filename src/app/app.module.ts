import { NgModule, Inject, PLATFORM_ID, APP_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { SharedModule } from './shared/shared.module';
import { RefreshTokenInterceptor } from './shared/interceptors/refresh-token.interceptor';
import { ApiService, UtilityService, ConnectionService, StorageService, AuthGuard } from './shared/services';
import { AuthService } from './auth/auth.service';
import { NavService } from './services/nav.service';
import { HeaderMenuService } from './services/header-menu.service';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { NavbarItemComponent } from './layouts/navbar-item/navbar-item.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { LoginComponent } from './auth/login/login.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './auth/auth.component';
import { PaginatorI18n } from './shared/paginator/paginator-i18n';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    NavbarComponent,
    NavbarItemComponent,
    SidebarComponent,
    ForgetPasswordComponent,
    LoginComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ecommerce-admin' }),
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: environment.SNACKBAR_DURATION }
    },
    {
      provide: MatPaginatorIntl,
      deps: [TranslateService],
      useFactory: (translate: TranslateService) => {
        const paginator = new PaginatorI18n();
        paginator.injectTranslateService(translate);
        return paginator;
      }
    },
    { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
    NavService,
    ApiService,
    StorageService,
    HeaderMenuService,
    UtilityService,
    ConnectionService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(APP_ID) private appId: string,
    private translate: TranslateService
  ) {
    this.translate.addLangs(['en', 'nl']);
    this.translate.setDefaultLang(environment.DEFAULT_LANG);
    this.translate.use(environment.DEFAULT_LANG);
    const platform = isPlatformBrowser(platformId) ? 'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
