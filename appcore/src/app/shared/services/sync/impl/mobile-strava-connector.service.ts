import { Injectable } from "@angular/core";
import { Http, HttpOptions } from "@capacitor-community/http";
import { StravaConnectorInfo } from "@elevate/shared/sync/connectors/strava-connector-info.model";
import { Activity, Lap } from "@elevate/shared/models/sync/activity.model";
import { Streams } from "@elevate/shared/models/activity-data/streams.model";
import { AthleteSnapshot } from "@elevate/shared/models/athlete/athlete-snapshot.model";
import { UserSettings } from "@elevate/shared/models/user-settings/user-settings.namespace";
import { ActivityComputer } from "@elevate/shared/sync/compute/activity-computer";
import { ConnectorType } from "@elevate/shared/sync/connectors/connector-type.enum";
import { Constant } from "@elevate/shared/constants/constant";
import { Movement } from "@elevate/shared/tools/movement";
import _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class MobileStravaConnector {
  constructor() {}

  public async fetchActivities(info: StravaConnectorInfo, page: number, perPage: number, after?: number): Promise<any[]> {
    const afterParam = after ? `&after=${Math.floor(after / 1000)}` : '';
    const options: HttpOptions = {
      url: `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}${afterParam}`,
      headers: { Authorization: `Bearer ${info.accessToken}` }
    };
    const response = await Http.get(options);
    return response.data;
  }

  public async fetchActivityDetail(id: number, info: StravaConnectorInfo): Promise<any> {
    const options: HttpOptions = {
      url: `https://www.strava.com/api/v3/activities/${id}`,
      headers: { Authorization: `Bearer ${info.accessToken}` }
    };
    const response = await Http.get(options);
    return response.data;
  }

  public async fetchStreams(id: number, info: StravaConnectorInfo): Promise<Streams> {
    const options: HttpOptions = {
      url: `https://www.strava.com/api/v3/activities/${id}/streams?keys=time,distance,latlng,altitude,velocity_smooth,heartrate,cadence,watts,temp,grade_adjusted_distance`,
      headers: { Authorization: `Bearer ${info.accessToken}` }
    };
    const response = await Http.get(options);
    const streams = new Streams();
    if (Array.isArray(response.data)) {
        for (const stream of response.data) {
            (streams as any)[stream.type] = stream.data;
        }
    }
    return streams;
  }

  public computeActivity(
    stravaBareActivity: any,
    stravaDetail: any,
    streams: Streams,
    athleteSnapshot: AthleteSnapshot,
    userSettings: UserSettings.BaseUserSettings
  ): Activity {
    const startTimestamp = Math.floor(new Date(stravaBareActivity.start_date).getTime() / 1000);
    const endTimestamp = startTimestamp + stravaBareActivity.elapsed_time;

    const activity = new Activity();
    activity.id = stravaBareActivity.id;
    activity.name = stravaBareActivity.name;
    activity.type = stravaBareActivity.type;
    activity.startTime = new Date(startTimestamp * 1000).toISOString();
    activity.endTime = new Date(endTimestamp * 1000).toISOString();
    activity.startTimestamp = startTimestamp;
    activity.endTimestamp = endTimestamp;
    activity.hasPowerMeter = stravaBareActivity.device_watts;
    activity.manual = stravaBareActivity.manual;
    activity.connector = ConnectorType.STRAVA;
    activity.device = stravaDetail?.device_name;
    activity.notes = stravaDetail?.description;

    if (stravaDetail?.laps) {
        activity.laps = this.extractLaps(stravaDetail.laps);
    }

    const stats = ActivityComputer.compute(
        activity,
        athleteSnapshot,
        userSettings,
        streams,
        true,
        true
    );

    activity.stats = stats;
    activity.athleteSnapshot = athleteSnapshot;
    return activity;
  }

  private extractLaps(stravaLaps: any[]): Lap[] {
    return stravaLaps.map((sl, index) => ({
        id: index + 1,
        active: !!(sl.distance || sl.average_speed),
        indexes: [sl.start_index, sl.end_index],
        distance: sl.distance,
        elapsedTime: sl.elapsed_time,
        movingTime: sl.moving_time,
        avgSpeed: _.round(sl.average_speed * Constant.MPS_KPH_FACTOR, 2),
        avgHr: sl.average_heartrate,
        avgWatts: sl.average_watts
    }));
  }
}
