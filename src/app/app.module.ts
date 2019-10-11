// tslint:disable: max-line-length
import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatCardModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatInputModule,
  MatTabsModule,
  MatOptionModule,
  MatSelectModule,
  MatGridListModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSlideToggleModule,
  MatCheckboxModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatBadgeModule,
  MatRippleModule,
  MatTooltipModule,
} from '@angular/material';
import { MatListModule } from '@angular/material/list';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


import { AppComponent } from './app.component';
import { DashboardComponent } from './components/shared/dashboard/dashboard.component';
import { ToolbarComponent } from './components/shared/toolbar/toolbar.component';
import { RegularClientComponent } from './components/dynamic-mode/regular-client/regular-client.component';
import { InputFormComponent } from './components/dynamic-mode/regular-client/input-form/input-form.component';
import { CategoryComponent } from './components/settings/category/category.component';
import { SettingsComponent } from './components/settings/settings/settings.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ReciptViewComponent } from './components/dynamic-mode/recipt-view/recipt-view.component';
import { UnitsComponent } from './components/settings/units/units.component';
import { PrinterConfigComponent } from './components/settings/settings/printer-config/printer-config.component';
import { ApplicationSettingsComponent } from './components/settings/settings/application-settings/application-settings.component';
import { RecordsComponent } from './components/dynamic-mode/records/records/records.component';
import { ViewRecordComponent } from './components/dynamic-mode/records/view/view-record/view-record.component';
import { UpdateRecordComponent } from './components/dynamic-mode/records/view/update/update-record/update-record.component';
import { StaticItemsComponent } from './components/static-mode/static-form/static-items.component';
import { ItemsManagerComponent } from './components/settings/settings/items/items-manager/items-manager.component';
import { AvailableItemsComponent } from './components/settings/settings/items/available-items/available-items/available-items.component';
import { UpdateItemDialogComponent } from './components/settings/settings/items/available-items/update/update-item-dialog/update-item-dialog.component';
import { ReciptPreviewComponent } from './components/static-mode/recipt-preview/recipt-preview.component';
import { StaticRecordsComponent } from './components/static-mode/static-records/static-records/static-records.component';
import { ViewDialogComponent } from './components/static-mode/static-records/view-dialog/view-dialog/view-dialog.component';
import { BackupRestoreComponent } from './components/settings/settings/backup-restore/backup-restore/backup-restore.component';
import { UiSettingsComponent } from './components/shared/alerts/ui-settings/ui-settings/ui-settings.component';
import { DataTimeComponent } from './components/shared/alerts/datetime/data-time/data-time.component';
import { LicenseDaysComponent } from './components/shared/alerts/license/licensedays/license-days/license-days.component';
import { UpdatesComponent } from './components/shared/alerts/updates/updates/updates.component';
import { InstallUpdateComponent } from './components/shared/alerts/updates/install-update/install-update.component';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ToolbarComponent,
    RegularClientComponent,
    InputFormComponent,
    CategoryComponent,
    SettingsComponent,
    ReciptViewComponent,
    UnitsComponent,
    PrinterConfigComponent,
    ApplicationSettingsComponent,
    RecordsComponent,
    ViewRecordComponent,
    UpdateRecordComponent,
    StaticItemsComponent,
    ItemsManagerComponent,
    AvailableItemsComponent,
    UpdateItemDialogComponent,
    ReciptPreviewComponent,
    StaticRecordsComponent,
    ViewDialogComponent,
    BackupRestoreComponent,
    UiSettingsComponent,
    DataTimeComponent,
    LicenseDaysComponent,
    UpdatesComponent,
    InstallUpdateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatTabsModule,
    MatSelectModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatRippleModule,
    MatTooltipModule,
    MatBadgeModule,
    ChartsModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  // tslint:disable-next-line: max-line-length
  entryComponents: [
    ViewRecordComponent,
    UpdateRecordComponent,
    UpdateItemDialogComponent,
    ViewDialogComponent,
    BackupRestoreComponent,
    UiSettingsComponent,
    DataTimeComponent,
    LicenseDaysComponent,
    UpdatesComponent,
    InstallUpdateComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
