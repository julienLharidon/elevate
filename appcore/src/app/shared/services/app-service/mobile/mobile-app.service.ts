import { Inject, Injectable } from "@angular/core";
import { AppService } from "../app.service";
import { ActivityService } from "../../activity/activity.service";
import { SyncService } from "../../sync/sync.service";
import { MobileActivityService } from "../../activity/impl/mobile-activity.service";
import { MobileSyncService } from "../../sync/impl/mobile-sync.service";

@Injectable()
export class MobileAppService extends AppService {
  constructor(
    @Inject(ActivityService) protected readonly activityService: MobileActivityService,
    @Inject(SyncService) protected readonly mobileSyncService: MobileSyncService
  ) {
    super(activityService, mobileSyncService);
  }

  public init(): void {
    super.init();
  }
}
