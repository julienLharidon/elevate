import { Inject, Injectable } from '@angular/core';
import { IPC_TUNNEL_SERVICE } from '../desktop/ipc/ipc-tunnel-service.token';
import { IpcTunnelService } from '@elevate/shared/electron/ipc-tunnel';
import { IGoogleSheetsUploadData } from '@elevate/shared/models/google-sheets.model';
import { GoogleSheetsConfigDialogDataModel } from '../shared/dialogs/google-sheets-config-dialog/google-sheets-config-dialog-data.model';
import { Channel } from '@elevate/shared/electron/channels.enum';
import { IpcMessage } from '@elevate/shared/electron/ipc-message';

@Injectable({
  providedIn: 'root'
})
export class GoogleConfigIpcService {

  constructor(@Inject(IPC_TUNNEL_SERVICE) private readonly ipcTunnelService: IpcTunnelService) {
  }

  public uploadData(data: IGoogleSheetsUploadData): Promise<void> {
    return this.ipcTunnelService.send(new IpcMessage(Channel.uploadGoogleSheets, data));
  }

  public getConfig(): Promise<GoogleSheetsConfigDialogDataModel> {
    return this.ipcTunnelService.send(new IpcMessage(Channel.getGoogleSheetsConfig));
  }

  public setConfig(config: GoogleSheetsConfigDialogDataModel): Promise<void> {
    return this.ipcTunnelService.send(new IpcMessage(Channel.setGoogleSheetsConfig, config));
  }

  public showOpenDialog(): Promise<string> {
    return this.ipcTunnelService.send(new IpcMessage(Channel.showOpenDialogSync));
  }
}
