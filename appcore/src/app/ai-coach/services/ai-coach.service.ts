import { Inject, Injectable } from "@angular/core";
import { Http, HttpOptions } from "@capacitor-community/http";
import { ActivityService } from "../../shared/services/activity/activity.service";
import { PropertiesDao } from "../../shared/dao/properties/properties.dao";
import _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class AiCoachService {
  constructor(
    @Inject(ActivityService) private readonly activityService: ActivityService,
    @Inject(PropertiesDao) private readonly propertiesDao: PropertiesDao
  ) {}

  public async getAiAdvice(model: string, userPrompt: string, weeks: number): Promise<string> {
    const properties = await this.propertiesDao.findOne();
    const apiKey = (properties as any).geminiApiKey;
    if (!apiKey) {
      throw new Error("Gemini API Key is missing. Please set it in settings.");
    }

    const activities = await this.activityService.find();
    const now = Date.now();
    const startTime = now - (weeks * 7 * 24 * 60 * 60 * 1000);
    const recentActivities = activities.filter(a => new Date(a.startTime).getTime() > startTime);

    const contextData = recentActivities.map(a => ({
      date: a.startTime,
      name: a.name,
      type: a.type,
      distance: a.stats?.distance,
      movingTime: a.stats?.movingTime,
      elevationGain: a.stats?.elevationGain,
      avgHr: a.stats?.heartRate?.avg,
      avgPower: a.stats?.power?.avg
    }));

    const fullPrompt = `${userPrompt}\n\nHere is my recent training data for the last ${weeks} weeks:\n${JSON.stringify(contextData, null, 2)}`;

    const options: HttpOptions = {
      url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      data: {
        contents: [{
          parts: [{ text: fullPrompt }]
        }]
      },
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await Http.post(options);
    if (response.status === 200) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      throw new Error(`Gemini API Error: ${response.data?.error?.message || response.status}`);
    }
  }
}
