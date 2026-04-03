import { Component, Inject, OnInit } from "@angular/core";
import { IPC_TUNNEL_SERVICE } from "../desktop/ipc/ipc-tunnel-service.token";
import { IpcTunnelService } from "@elevate/shared/electron/ipc-tunnel";
import { IpcStorageService } from "../desktop/ipc/ipc-storage.service";
import { ActivityService } from "../shared/services/activity/activity.service";
import { Channel } from "@elevate/shared/electron/channels.enum";
import { IpcMessage } from "@elevate/shared/electron/ipc-message";
import { Activity } from "@elevate/shared/models/sync/activity.model";
import moment from "moment";

@Component({
  selector: "app-ai-coach",
  templateUrl: "./ai-coach.component.html",
  styleUrls: ["./ai-coach.component.scss"]
})
export class AiCoachComponent implements OnInit {
  public apiKey: string = "";
  public selectedModel: string = "gemini-1.5-pro";
  public instructions: string = "";
  public weeksBack: number = 4;
  public response: string = "";
  public loading: boolean = false;

  public models: string[] = [
    "gemini-2.0-flash-exp",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b"
  ];

  constructor(
    @Inject(IPC_TUNNEL_SERVICE) private readonly ipcTunnelService: IpcTunnelService,
    @Inject(IpcStorageService) private readonly ipcStorage: IpcStorageService,
    @Inject(ActivityService) private readonly activityService: ActivityService
  ) {}

  public async ngOnInit(): Promise<void> {
    this.apiKey = (await this.ipcStorage.get<string>("aiCoach.apiKey")) || "";
    this.selectedModel = (await this.ipcStorage.get<string>("aiCoach.model")) || "gemini-1.5-pro";
    this.instructions = (await this.ipcStorage.get<string>("aiCoach.instructions")) || "";
    this.weeksBack = (await this.ipcStorage.get<number>("aiCoach.weeksBack")) || 4;
  }

  public async onSaveSettings(): Promise<void> {
    await this.ipcStorage.set("aiCoach.apiKey", this.apiKey);
    await this.ipcStorage.set("aiCoach.model", this.selectedModel);
    await this.ipcStorage.set("aiCoach.instructions", this.instructions);
    await this.ipcStorage.set("aiCoach.weeksBack", this.weeksBack);
  }

  public async tellMeCoach(): Promise<void> {
    this.loading = true;
    this.response = "";
    try {
      await this.onSaveSettings();

      const fromDate = moment().subtract(this.weeksBack, "weeks").startOf("day").toISOString();
      const query = {
        startTime: { $gte: fromDate }
      };
      const activities = await this.activityService.find(query);

      const activitiesData = activities.map(a => {
        const hrZones = a.stats?.heartRate?.zones ? a.stats.heartRate.zones.map(z => `${z.from}-${z.to}bpm: ${moment.duration(z.s, "seconds").humanize()}`).join(", ") : "N/A";
        return {
          date: moment(a.startTime).format("YYYY-MM-DD"),
          type: a.type,
          name: a.name,
          duration: moment.duration(a.stats?.movingTime, "seconds").humanize(),
          distance: a.stats?.distance ? (a.stats.distance / 1000).toFixed(2) + "km" : "N/A",
          avgPower: a.stats?.power?.avg ? a.stats.power.avg + "W" : "N/A",
          avgCadence: a.stats?.cadence?.avg ? a.stats.cadence.avg + "rpm" : "N/A",
          intensityScore: a.stats?.scores?.stress?.hrss || a.stats?.scores?.stress?.pss || "N/A",
          avgHR: a.stats?.heartRate?.avg ? a.stats.heartRate.avg + "bpm" : "N/A",
          elevationGain: a.stats?.elevation?.ascent ? a.stats.elevation.ascent + "m" : "N/A",
          hrZones: hrZones
        };
      });

      const prompt = `
        Instructions for the coach: ${this.instructions}

        Activity history for the last ${this.weeksBack} weeks:
        ${JSON.stringify(activitiesData, null, 2)}

        Please analyze this data and provide feedback.
      `;

      const contents = [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ];

      const message = new IpcMessage(Channel.getAiCoachResponse, this.apiKey, this.selectedModel, contents);
      const result = await this.ipcTunnelService.send<IpcMessage, any>(message);

      if (result && result.candidates && result.candidates[0] && result.candidates[0].content) {
        this.response = result.candidates[0].content.parts[0].text;
      } else {
        this.response = "No response from AI.";
      }
    } catch (error) {
      this.response = "Error: " + (error.message || error);
    } finally {
      this.loading = false;
    }
  }
}
