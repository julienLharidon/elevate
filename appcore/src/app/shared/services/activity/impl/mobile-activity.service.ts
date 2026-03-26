import { Inject, Injectable } from "@angular/core";
import { ActivityService } from "../activity.service";
import { ActivityDao } from "../../../dao/activity/activity.dao";
import { AthleteSnapshotResolverService } from "../../athlete-snapshot-resolver/athlete-snapshot-resolver.service";
import { LoggerService } from "../../logging/logger.service";
import { Subject } from "rxjs";
import { StreamsService } from "../../streams/streams.service";
import { Activity } from "@elevate/shared/models/sync/activity.model";
import { UserSettings } from "@elevate/shared/models/user-settings/user-settings.namespace";
import { AthleteSnapshot } from "@elevate/shared/models/athlete/athlete-snapshot.model";
import { Streams } from "@elevate/shared/models/activity-data/streams.model";
import { ActivityComputer } from "@elevate/shared/sync/compute/activity-computer";
import { SplitCalculator } from "@elevate/shared/sync/compute/split-calculator";
import { SplitRequest } from "@elevate/shared/models/splits/split-request.model";
import { SplitResponse } from "@elevate/shared/models/splits/split-response.model";

@Injectable()
export class MobileActivityService extends ActivityService {
  constructor(
    @Inject(ActivityDao) public readonly activityDao: ActivityDao,
    @Inject(AthleteSnapshotResolverService) public readonly athleteSnapshotResolver: AthleteSnapshotResolverService,
    @Inject(StreamsService) public readonly streamsService: StreamsService,
    @Inject(LoggerService) protected readonly logger: LoggerService
  ) {
    super(activityDao, athleteSnapshotResolver, logger);
    this.recalculate$ = new Subject<any>();
  }

  public recalculate$: Subject<any>;

  public compute(
    activity: Activity,
    athleteSnapshotModel: AthleteSnapshot,
    streams: Streams,
    userSettings: UserSettings.BaseUserSettings
  ): Promise<Activity> {
    const computedActivityStats = ActivityComputer.compute(
      activity,
      athleteSnapshotModel,
      userSettings,
      streams,
      true,
      true
    );
    const computedActivity = Object.assign(activity, computedActivityStats);
    computedActivity.athleteSnapshot = athleteSnapshotModel;
    return Promise.resolve(computedActivity as Activity);
  }

  public computeSplit(splitRequest: SplitRequest): Promise<SplitResponse> {
    const splitCalculator = new SplitCalculator(splitRequest.scaleStream, splitRequest.dataStreams[0].stream);
    const result = splitCalculator.compute(splitRequest.range);

    const response: SplitResponse = {
        type: splitRequest.type,
        range: splitRequest.range,
        results: [{
            streamKey: splitRequest.dataStreams[0].streamKey,
            value: result.value,
            indexes: [result.start, result.end]
        }]
    };
    return Promise.resolve(response);
  }

  public recalculateSingle(activity: Activity, userSettings: UserSettings.BaseUserSettings): Promise<Activity> {
    return this.athleteSnapshotResolver
      .update()
      .then(() => {
        return this.athleteSnapshotResolver.resolve(new Date(activity.startTime));
      })
      .then((athleteSnapshotModel: AthleteSnapshot) => {
        return this.streamsService.getInflatedById(activity.id).then(streams => {
          if (activity.manual) {
            activity.athleteSnapshot = athleteSnapshotModel;
            return this.put(activity);
          }
          return this.compute(activity, athleteSnapshotModel, streams, userSettings).then(computedActivity => {
            computedActivity.lastEditTime = new Date().toISOString();
            return this.put(computedActivity);
          });
        });
      });
  }

  public removeById(id: number | string): Promise<void> {
    return super.removeById(id).then(() => {
      return this.streamsService.removeById(id);
    });
  }
}
