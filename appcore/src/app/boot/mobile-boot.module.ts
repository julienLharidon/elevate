import { ErrorHandler, NgModule } from "@angular/core";
import { MENU_ITEMS_PROVIDER } from "../shared/services/menu-items/menu-items-provider.interface";
import { MobileMenuItemsProvider } from "../shared/services/menu-items/impl/mobile-menu-items-provider.service";
import { TOP_BAR_COMPONENT } from "../top-bar/top-bar.component";
import { DesktopTopBarComponent } from "../top-bar/desktop-top-bar.component";
import { AppLoadService } from "../app-load/app-load.service";
import { MobileLoadService } from "../app-load/mobile/mobile-load.service";
import { APP_MORE_MENU_COMPONENT } from "../app-more-menu/app-more-menu.component";
import { DesktopAppMoreMenuComponent } from "../app-more-menu/desktop-app-more-menu.component";
import { DesktopSyncBarComponent } from "../sync-bar/desktop-sync-bar.component";
import { SYNC_BAR_COMPONENT } from "../sync-bar/sync-bar.component";
import { DesktopRecalculateActivitiesBarComponent } from "../recalculate-activities-bar/desktop-recalculate-activities-bar.component";
import { RECALCULATE_ACTIVITIES_BAR_COMPONENT } from "../recalculate-activities-bar/recalculate-activities-bar.component";
import { SYNC_MENU_COMPONENT } from "../sync-menu/sync-menu.component";
import { DesktopSyncMenuComponent } from "../sync-menu/desktop/desktop-sync-menu.component";
import { DesktopErrorsSyncDetailsDialogComponent } from "../sync-bar/desktop-errors-sync-details-dialog.component";
import { CoreModule } from "../core/core.module";
import { MobileRoutingModule } from "../shared/modules/routing/mobile-routing.module";
import { AppService } from "../shared/services/app-service/app.service";
import { MobileAppService } from "../shared/services/app-service/mobile/mobile-app.service";
import { UPDATE_BAR_COMPONENT } from "../update-bar/update-bar.component";
import { DesktopUpdateBarComponent } from "../update-bar/desktop-update-bar.component";
import { DesktopSplashScreenComponent } from "../app-load/desktop/desktop-splash-screen.component";
import { SPLASH_SCREEN_COMPONENT } from "../app-load/splash-screen.component";
import { DesktopElevateErrorHandler } from "../errors-handler/desktop-elevate-error-handler";

@NgModule({
  imports: [CoreModule, MobileRoutingModule],
  exports: [CoreModule, MobileRoutingModule],
  declarations: [
    DesktopSplashScreenComponent,
    DesktopRecalculateActivitiesBarComponent,
    DesktopUpdateBarComponent,
    DesktopSyncBarComponent,
    DesktopTopBarComponent,
    DesktopAppMoreMenuComponent,
    DesktopSyncMenuComponent,
    DesktopErrorsSyncDetailsDialogComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: DesktopElevateErrorHandler },
    { provide: AppLoadService, useClass: MobileLoadService },
    { provide: AppService, useClass: MobileAppService },
    { provide: SPLASH_SCREEN_COMPONENT, useValue: DesktopSplashScreenComponent },
    { provide: MENU_ITEMS_PROVIDER, useClass: MobileMenuItemsProvider },
    { provide: UPDATE_BAR_COMPONENT, useValue: DesktopUpdateBarComponent },
    { provide: SYNC_BAR_COMPONENT, useValue: DesktopSyncBarComponent },
    { provide: RECALCULATE_ACTIVITIES_BAR_COMPONENT, useValue: DesktopRecalculateActivitiesBarComponent },
    { provide: TOP_BAR_COMPONENT, useValue: DesktopTopBarComponent },
    { provide: APP_MORE_MENU_COMPONENT, useValue: DesktopAppMoreMenuComponent },
    { provide: SYNC_MENU_COMPONENT, useValue: DesktopSyncMenuComponent }
  ]
})
export class TargetBootModule {}
