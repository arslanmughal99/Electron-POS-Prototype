import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./components/shared/dashboard/dashboard.component";
import { RegularClientComponent } from "./components/dynamic-mode/regular-client/regular-client.component";
import { SettingsComponent } from "./components/settings/settings/settings.component";
import { StaticItemsComponent } from "./components/static-mode/static-form/static-items.component";
import { StaticRecordsComponent } from "./components/static-mode/static-records/static-records/static-records.component";
import { RecordsComponent } from "./components/dynamic-mode/records/records/records.component";
import { RouteGuardsGuard } from "./services/guards/route-guards.guard";
import { AttributesComponent } from "./components/shared/attributes/attributes/attributes.component";
import { AvailableItemsComponent } from "./components/shared/items/available-items/available-items/available-items.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    pathMatch: "full",
    // canActivate: [RouteGuardsGuard]
  },
  {
    path: "regular-client",
    component: RegularClientComponent,
    pathMatch: "full",
    // canActivate: [RouteGuardsGuard]
  },
  {
    path: "settings",
    component: SettingsComponent,
    pathMatch: "full",
    // canActivate: [RouteGuardsGuard]
  },
  {
    path: "static-items",
    component: StaticItemsComponent,
    pathMatch: "full",
    // canActivate: [RouteGuardsGuard]
  },
  {
    path: "static-bills",
    component: StaticRecordsComponent,
    pathMatch: "full",
    // canActivate: [RouteGuardsGuard]
  },
  {
    path: "regular-bills",
    component: RecordsComponent,
    pathMatch: "full",
    // canActivate: [RouteGuardsGuard]
  },
  {
    path: "items-manager",
    component: AvailableItemsComponent,
    pathMatch: "full",
    // canActivate: [RouteGuardsGuard]
  },
  {
    path: "attributes",
    component: AttributesComponent,
    pathMatch: "full",
    // canActivate: [RouteGuardsGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [RouteGuardsGuard],
})
export class AppRoutingModule {}
