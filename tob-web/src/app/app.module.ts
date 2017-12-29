import { APP_BASE_HREF } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BusinessComponent } from './business/business.component';
import { CertComponent } from './cert/cert.component';
import { CustomerComponent } from './customer/customer.component';
import { SearchBoxDirective } from './search-box/search-box.directive';
import { GeneralDataService } from 'app/general-data.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminModule } from 'app/admin/admin.module';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { getLang } from './i18n-providers';

/**
 * Sets the app base href based on the current locale
 * and updates the DOM tag accordingly
 * @param locale
 * @returns {string}
 */
export function appBaseHrefProvider(locale: string) {
  locale = locale.match(/^(en|fr)$/) ? locale : getLang();
  document.querySelector('base').href = `/${locale}/`;
  return `/${locale}/`;
}

@NgModule({
  declarations: [
    AppComponent,
    BusinessComponent,
    CertComponent,
    CustomerComponent,
    SearchBoxDirective,
    DashboardComponent,
    BreadcrumbComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    NgbModule,
    AdminModule,
  ],
  providers: [
    GeneralDataService,
    {provide: APP_BASE_HREF, useFactory: appBaseHrefProvider, deps: [LOCALE_ID]}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
