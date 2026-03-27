import { NgModule } from "@angular/core";
import { CoreModule } from "../../../core/core.module";
import { MobileRoutingModule } from "../routing/mobile-routing.module";
import { DataStore } from "../../data-store/data-store";
import { MobileDataStore } from "../../data-store/impl/mobile-data-store.service";
import { AthleteService } from "../../services/athlete/athlete.service";
import { MobileAthleteService } from "../../services/athlete/mobile/mobile-athlete.service";
import { UserSettingsService } from "../../services/user-settings/user-settings.service";
import { MobileUserSettingsService } from "../../services/user-settings/mobile/mobile-user-settings.service";
import { ActivityService } from "../../services/activity/activity.service";
import { MobileActivityService } from "../../services/activity/impl/mobile-activity.service";
import { VersionsProvider } from "../../services/versions/versions-provider";
import { MobileVersionsProvider } from "../../services/versions/impl/mobile-versions-provider.service";
import { SyncService } from "../../services/sync/sync.service";
import { MobileSyncService } from "../../services/sync/impl/mobile-sync.service";
import { MobileStravaConnector } from "../../services/sync/impl/mobile-strava-connector.service";
import { StravaConnectorInfoService } from "../../services/strava-connector-info/strava-connector-info.service";
import { StravaConnectorInfoDao } from "../../dao/strava-connector-info/strava-connector-info.dao";
import { ConnectorSyncDateTimeDao } from "../../dao/sync/connector-sync-date-time.dao";
import { PropertiesDao } from "../../dao/properties/properties.dao";
import { OPEN_RESOURCE_RESOLVER } from "../../services/links-opener/open-resource-resolver";

@NgModule({
  imports: [CoreModule, MobileRoutingModule],
  exports: [CoreModule, MobileRoutingModule],
  declarations: [],
  providers: [
    StravaConnectorInfoService,
    StravaConnectorInfoDao,
    ConnectorSyncDateTimeDao,
    PropertiesDao,
    { provide: DataStore, useClass: MobileDataStore },
    { provide: AthleteService, useClass: MobileAthleteService },
    { provide: UserSettingsService, useClass: MobileUserSettingsService },
    { provide: ActivityService, useClass: MobileActivityService },
    { provide: VersionsProvider, useClass: MobileVersionsProvider },
    { provide: OPEN_RESOURCE_RESOLVER, useValue: { openLink: (url: string) => window.open(url, '_blank') } },
    MobileStravaConnector,
    { provide: SyncService, useClass: MobileSyncService }
  ]
})
export class TargetModule {}
