import { Inject, Injectable, OnDestroy } from "@angular/core";
import { SyncService } from "../sync.service";
import { VersionsProvider } from "../../versions/versions-provider";
import { AthleteService } from "../../athlete/athlete.service";
import { UserSettingsService } from "../../user-settings/user-settings.service";
import { LoggerService } from "../../logging/logger.service";
import { Subject } from "rxjs";
import { StravaConnectorInfoService } from "../../strava-connector-info/strava-connector-info.service";
import { ActivityService } from "../../activity/activity.service";
import { SyncState } from "../sync-state.enum";
import { ConnectorSyncDateTimeDao } from "../../../dao/sync/connector-sync-date-time.dao";
import { StreamsService } from "../../streams/streams.service";
import { DataStore } from "../../../data-store/data-store";
import { Router } from "@angular/router";
import { AppRoutes } from "../../../models/app-routes";
import { SyncEvent } from "@elevate/shared/sync/events/sync.event";
import { ConnectorSyncDateTime } from "@elevate/shared/models/sync/connector-sync-date-time.model";
import { ConnectorType } from "@elevate/shared/sync/connectors/connector-type.enum";
import { Activity } from "@elevate/shared/models/sync/activity.model";
import { StravaConnectorInfo } from "@elevate/shared/sync/connectors/strava-connector-info.model";
import { AthleteModel } from "@elevate/shared/models/athlete/athlete.model";
import { ErrorSyncEvent } from "@elevate/shared/sync/events/error-sync.event";
import { CompleteSyncEvent } from "@elevate/shared/sync/events/complete-sync.event";
import { UserSettings } from "@elevate/shared/models/user-settings/user-settings.namespace";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Http, HttpOptions } from "@capacitor-community/http";

@Injectable()
export class MobileSyncService extends SyncService<ConnectorSyncDateTime[]> implements OnDestroy {
  public syncEvents$: Subject<SyncEvent>;
  public currentConnectorType: ConnectorType;
  private stopRequested = false;

  constructor(
    @Inject(VersionsProvider) public readonly versionsProvider: VersionsProvider,
    @Inject(DataStore) public readonly dataStore: DataStore<object>,
    @Inject(ActivityService) public readonly activityService: ActivityService,
    @Inject(StreamsService) public readonly streamsService: StreamsService,
    @Inject(AthleteService) public readonly athleteService: AthleteService,
    @Inject(UserSettingsService) public readonly userSettingsService: UserSettingsService,
    @Inject(LoggerService) public readonly logger: LoggerService,
    @Inject(ConnectorSyncDateTimeDao) public readonly connectorSyncDateTimeDao: ConnectorSyncDateTimeDao,
    @Inject(StravaConnectorInfoService) public readonly stravaConnectorInfoService: StravaConnectorInfoService,
    @Inject(MatSnackBar) private readonly snackBar: MatSnackBar,
    @Inject(Router) public readonly router: Router
  ) {
    super(
      versionsProvider,
      dataStore,
      activityService,
      streamsService,
      athleteService,
      userSettingsService,
      logger
    );
    this.syncEvents$ = new Subject<SyncEvent>();
  }

  public async sync(fastSync: boolean = null, forceSync: boolean = null): Promise<void> {
    this.currentConnectorType = ConnectorType.STRAVA;
    this.stopRequested = false;
    this.isSyncing$.next(true);

    try {
      const athleteModel = await this.athleteService.fetch();
      const userSettings = await this.userSettingsService.fetch();
      const stravaConnectorInfo = await this.stravaConnectorInfoService.fetch();
      const mostRecentActivity = await this.activityService.findMostRecent();

      let syncFromDateTime = null;
      if (fastSync && mostRecentActivity) {
        syncFromDateTime = mostRecentActivity.startTimestamp * 1000;
      }

      await this.performStravaSync(stravaConnectorInfo, athleteModel, userSettings, syncFromDateTime);

      this.isSyncing$.next(false);
      this.syncEvents$.next(new CompleteSyncEvent(ConnectorType.STRAVA));
    } catch (error) {
      this.logger.error("Sync failed", error);
      this.isSyncing$.next(false);
      this.syncEvents$.next(ErrorSyncEvent.UNHANDLED_ERROR_SYNC.create(ConnectorType.STRAVA, error.message || error.toString()));
      throw error;
    }
  }

  private async performStravaSync(
    info: StravaConnectorInfo,
    athleteModel: AthleteModel,
    userSettings: UserSettings.BaseUserSettings,
    syncFromDateTime: number
  ): Promise<void> {
    if (!info.accessToken || info.expiresAt < Date.now() / 1000) {
      await this.refreshStravaTokens(info);
    }

    let page = 1;
    const perPage = 30;
    let hasMore = true;

    while (hasMore && !this.stopRequested) {
      const activities = await this.fetchStravaActivities(info, page, perPage, syncFromDateTime);
      if (activities.length === 0) {
        hasMore = false;
        break;
      }

      for (const stravaActivity of activities) {
        if (this.stopRequested) break;
        await this.processStravaActivity(stravaActivity, info, athleteModel, userSettings);
      }

      page++;
      if (activities.length < perPage) {
        hasMore = false;
      }
    }
  }

  private async refreshStravaTokens(info: StravaConnectorInfo): Promise<void> {
    const options: HttpOptions = {
      url: 'https://www.strava.com/oauth/token',
      data: {
        client_id: info.clientId,
        client_secret: info.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: info.refreshToken
      }
    };
    const response = await Http.post(options);
    if (response.status === 200) {
      info.accessToken = response.data.access_token;
      info.refreshToken = response.data.refresh_token;
      info.expiresAt = response.data.expires_at;
      await this.stravaConnectorInfoService.update(info);
    } else {
      throw new Error("Failed to refresh Strava tokens");
    }
  }

  private async fetchStravaActivities(info: StravaConnectorInfo, page: number, perPage: number, after: number): Promise<any[]> {
    const afterParam = after ? `&after=${Math.floor(after / 1000)}` : '';
    const options: HttpOptions = {
      url: `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}${afterParam}`,
      headers: { Authorization: `Bearer ${info.accessToken}` }
    };
    const response = await Http.get(options);
    return response.data;
  }

  private async processStravaActivity(
    stravaBareActivity: any,
    info: StravaConnectorInfo,
    athleteModel: AthleteModel,
    userSettings: UserSettings.BaseUserSettings
  ): Promise<void> {
    const existing = await this.activityService.getById(stravaBareActivity.id);
    if (existing) return;
  }

  public async stop(): Promise<void> {
    this.stopRequested = true;
  }

  public async clearSyncTime(): Promise<void> {
    await this.connectorSyncDateTimeDao.clear();
  }

  public async getSyncState(): Promise<SyncState> {
    const count = await this.activityService.count();
    return count > 0 ? SyncState.SYNCED : SyncState.NOT_SYNCED;
  }

  public backup(...args): any { throw new Error("Not implemented"); }
  public restore(...arg): any { throw new Error("Not implemented"); }
  public redirect(): void { this.router.navigate([AppRoutes.connectors]); }

  public ngOnDestroy(): void {}
}
