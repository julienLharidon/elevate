import { IpcListener } from "./ipc-listener.interface";
import { inject, singleton } from "tsyringe";
import { IpcTunnelService } from "@elevate/shared/electron/ipc-tunnel";
import { Channel } from "@elevate/shared/electron/channels.enum";
import { HttpClient } from "../clients/http.client";

@singleton()
export class IpcAiCoachListener implements IpcListener {
  constructor(@inject(HttpClient) private readonly httpClient: HttpClient) {}

  public startListening(ipcTunnelService: IpcTunnelService): void {
    ipcTunnelService.on<[string, string, any], any>(Channel.getAiCoachResponse, async payload => {
      const [apiKey, model, contents] = payload;
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await this.httpClient.post(url, {
          contents: contents
        });
        return response.data;
      } catch (error) {
        if (error.response) {
          return Promise.reject(new Error(JSON.stringify(error.response.data)));
        }
        return Promise.reject(error);
      }
    });
  }
}
